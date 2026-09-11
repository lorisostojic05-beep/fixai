// pages/api/paga-saldo.js
// POST { clienteToken } → l'indirizzo Stripe dove pagare il saldo.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  L'IMPORTO NON ARRIVA MAI DAL BROWSER                                     │
// │                                                                           │
// │  Questo endpoint riceve UN SOLO dato: il token del cliente. Il prezzo lo  │
// │  legge dalla riga del database, dov'e' stato congelato quando il cliente  │
// │  ha accettato il preventivo.                                              │
// │                                                                           │
// │  Se accettasse un importo dalla richiesta, chiunque potrebbe aprire gli   │
// │  strumenti del browser e pagare 1 € una riparazione da 120.               │
// └───────────────────────────────────────────────────────────────────────────┘
//
// Il pagamento NON viene confermato qui. Quando il cliente torna dal sito di
// Stripe non succede niente di importante: la conferma arriva al webhook,
// firmata, anche se il cliente chiude il telefono un secondo dopo aver pagato.

import { stripe, chiaveIdempotenza } from "../../lib/stripe.js";
import { supabaseAdmin as db } from "../../lib/supabase-admin.js";
import { STATI } from "../../lib/stati-riparazione.js";
import { gruppo } from "../../lib/bonifico.js";
import { inEuro } from "../../lib/soldi.js";
import { testiPer } from "../../lib/testi.js";
import { riempi } from "../../lib/frasi.js";
import { linguaValida, PREDEFINITA, prefissoDi } from "../../lib/lingue.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { clienteToken } = req.body || {};
  if (!clienteToken) return res.status(400).json({ error: "Accesso non riconosciuto" });

  const { data: r } = await db
    .from("richieste_intervento")
    .select(
      "id, stato, appliance, brand, lingua, saldo_cliente_centesimi, prezzo_finale_centesimi, " +
        "credito_applicato_centesimi, saldo_stripe_session_id"
    )
    .eq("cliente_token", clienteToken)
    .maybeSingle();

  if (!r) return res.status(403).json({ error: "Accesso non riconosciuto" });

  if (r.stato !== STATI.PREVENTIVO_ACCETTATO) {
    return res.status(400).json({ error: `Il lavoro e' in stato "${r.stato}": non c'e' niente da pagare` });
  }

  const daPagare = r.saldo_cliente_centesimi;
  if (!Number.isInteger(daPagare) || daPagare <= 0) {
    // Succede quando la riparazione costa meno del credito: e' gia' coperta.
    // Non si apre nessuna cassa per un importo zero.
    return res.status(400).json({ error: "Non c'e' nessun saldo da pagare" });
  }

  const lingua = linguaValida(r.lingua) ? r.lingua : PREDEFINITA;
  const t = testiPer(lingua).riparazione;
  const base = req.headers.origin || `https://${req.headers.host}`;
  const ritorno = `${base}${prefissoDi(lingua)}/riparazione?c=${encodeURIComponent(clienteToken)}`;
  const macchina = [r.brand, r.appliance].filter(Boolean).join(" ") || "elettrodomestico";

  try {
    const sessione = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: riempi(t.vocePagamento, { macchina }),
                // La riga che spiega il conto dentro la cassa di Stripe: il
                // cliente vede 110,10 e deve capire da dove esce.
                description: riempi(t.vocePagamentoDettaglio, {
                  totale: inEuro(r.prezzo_finale_centesimi, lingua),
                  credito: inEuro(r.credito_applicato_centesimi, lingua),
                }),
              },
              unit_amount: daPagare,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${ritorno}&pagamento=ok`,
        cancel_url: `${ritorno}&pagamento=annullato`,
        // Il webhook ritrova la riparazione da qui. Senza, un pagamento
        // riuscito arriverebbe senza sapere a chi appartiene.
        metadata: { richiesta_id: String(r.id) },
        payment_intent_data: {
          // Lo stesso nome del bonifico: nei rendiconti Stripe incasso e
          // pagamento al tecnico restano appaiati.
          transfer_group: gruppo(r.id),
          metadata: { richiesta_id: String(r.id) },
        },
      },
      // Se il cliente tocca due volte "paga", non si aprono due casse.
      { idempotencyKey: chiaveIdempotenza("saldo", r.id, daPagare) }
    );

    return res.status(200).json({ url: sessione.url });
  } catch (e) {
    console.error("Cassa saldo non creata:", e.message);
    return res.status(500).json({ error: "Non sono riuscito ad aprire il pagamento" });
  }
}
