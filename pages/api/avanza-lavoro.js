// pages/api/avanza-lavoro.js
// Le tappe del lavoro dopo il pagamento, e il bonifico finale.
//
// POST { token, richiestaId, azione }
//   azione: "inizia"    → il tecnico e' sul posto
//   azione: "completa"  → il lavoro e' finito: parte il bonifico
//   azione: "annulla"   → il tecnico rinuncia
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  IL BONIFICO PARTE QUI, E SOLO QUI                                        │
// │                                                                           │
// │  Non quando il cliente accetta il preventivo, non quando paga: quando il  │
// │  lavoro e' dichiarato finito. Fra il pagamento e questo momento i soldi   │
// │  restano fermi su Fixi — ed e' l'unica cosa che permette di rimborsare    │
// │  un intervento che non e' mai stato fatto.                                │
// └───────────────────────────────────────────────────────────────────────────┘

import { supabaseAdmin as db } from "../../lib/supabase-admin.js";
import { STATI, verificaPassaggio } from "../../lib/stati-riparazione.js";
import { eseguiBonifico } from "../../lib/bonifico.js";
import { usaCredito, liberaCredito } from "../../lib/credito.js";

const ORA = () => new Date().toISOString();

async function tecnicoDa(token) {
  if (!token) return null;
  const { data } = await db
    .from("tecnici")
    .select("id, approvato")
    .eq("accesso_token", token)
    .maybeSingle();
  return data?.approvato ? data : null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { token, richiestaId, azione } = req.body || {};
  const tecnico = await tecnicoDa(token);
  if (!tecnico) return res.status(403).json({ error: "Accesso non riconosciuto" });

  const { data: r } = await db
    .from("richieste_intervento")
    .select("id, stato, tecnico_id")
    .eq("id", richiestaId)
    .maybeSingle();
  if (!r) return res.status(404).json({ error: "Lavoro non trovato" });

  // Un tecnico agisce solo sui lavori suoi. Vale anche qui e non solo nella
  // pagina: la pagina si puo' scavalcare.
  if (String(r.tecnico_id) !== String(tecnico.id)) {
    return res.status(403).json({ error: "Questo lavoro non e' tuo" });
  }

  const destinazioni = {
    inizia: STATI.IN_CORSO,
    completa: STATI.COMPLETATA,
    annulla: STATI.ANNULLATA,
  };
  const nuovo = destinazioni[azione];
  if (!nuovo) return res.status(400).json({ error: "Azione sconosciuta" });

  const passaggio = verificaPassaggio(r.stato, nuovo);
  if (!passaggio.ok) return res.status(400).json({ error: passaggio.perche });

  const campi = { stato: nuovo };
  if (azione === "inizia") campi.iniziata_at = ORA();
  if (azione === "completa") campi.completata_at = ORA();
  if (azione === "annulla") {
    campi.annullata_at = ORA();
    campi.annullata_da = "tecnico";
  }

  // Condizionato sullo stato di partenza: due tocchi ravvicinati non fanno
  // due avanzamenti.
  const { data: aggiornata } = await db
    .from("richieste_intervento")
    .update(campi)
    .eq("id", r.id)
    .eq("stato", r.stato)
    .select("id")
    .maybeSingle();

  if (!aggiornata) return res.status(409).json({ error: "Lo stato e' gia' cambiato" });

  // ── Il tecnico rinuncia ───────────────────────────────────────────────────
  if (azione === "annulla") {
    // Il credito torna disponibile: il cliente potra' rivolgersi a un altro
    // tecnico sulla stessa diagnosi senza perdere i suoi 9,90 €.
    await liberaCredito(db, r.id);
    // Il rimborso del saldo gia' pagato NON si fa in automatico: se c'erano
    // soldi in mezzo va guardato da una persona. Resta segnalato in admin.
    return res.status(200).json({ ok: true, stato: nuovo });
  }

  if (azione !== "completa") return res.status(200).json({ ok: true, stato: nuovo });

  // ── Lavoro finito: si chiude il conto ─────────────────────────────────────
  // Da qui i 9,90 € smettono di essere ricavo della diagnosi e diventano
  // parte del valore della riparazione.
  await usaCredito(db, r.id);

  const bonifico = await eseguiBonifico(db, r.id);

  // Se il bonifico non parte, il lavoro resta completato lo stesso: il
  // cliente ha avuto la riparazione. Il pagamento al tecnico si recupera
  // dopo, e l'admin lo vede in sospeso.
  return res.status(200).json({
    ok: true,
    stato: nuovo,
    bonifico: bonifico.ok
      ? { fatto: true, id: bonifico.transferId }
      : { fatto: false, motivo: bonifico.motivo, riprovabile: !!bonifico.riprovabile },
  });
}
