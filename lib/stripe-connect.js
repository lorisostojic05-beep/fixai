// lib/stripe-connect.js
// Il conto Stripe del tecnico: crearlo, farglielo compilare, sapere se e'
// pronto a ricevere soldi.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  PERCHE' "EXPRESS" E NON ALTRO                                            │
// │                                                                           │
// │  I tecnici sono artigiani con partita IVA. Con Express e' Stripe a        │
// │  chiedere documenti, verificare l'identita' e gestire gli obblighi        │
// │  fiscali: Fixi non vede mai una carta d'identita' e non la conserva.      │
// │  Con Standard il tecnico dovrebbe avere e saper usare un account Stripe   │
// │  suo, che e' troppo per chi ripara lavatrici.                             │
// └───────────────────────────────────────────────────────────────────────────┘
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  PERCHE' I SOLDI PASSANO DA FIXI E NON VANNO DIRITTI AL TECNICO           │
// │                                                                           │
// │  Stripe permette di girare un incasso al destinatario nello stesso        │
// │  momento in cui il cliente paga (destination charge). Qui non si puo',    │
// │  per due motivi che nascono dal modello, non da una preferenza:           │
// │                                                                           │
// │  1. Quando il cliente paga i 9,90 € della diagnosi, il tecnico NON        │
// │     ESISTE ANCORA. Non c'e' nessuna destinazione da scrivere.             │
// │                                                                           │
// │  2. Il saldo si incassa PRIMA che il lavoro sia fatto. Se i soldi         │
// │     arrivassero subito al tecnico, un intervento mai eseguito si          │
// │     rimborserebbe soltanto chiedendoglieli indietro.                      │
// │                                                                           │
// │  Quindi: Fixi incassa tutto, tiene i soldi fermi, e fa il bonifico        │
// │  (transfer) solo a lavoro finito. E' il modello "platform charges +       │
// │  separate transfers".                                                     │
// └───────────────────────────────────────────────────────────────────────────┘

import { stripe, chiaveIdempotenza } from "./stripe.js";

/** Il tecnico puo' essere pagato? Serve che Stripe dica di si' su entrambi. */
export function puoEsserePagato(tecnico) {
  return Boolean(tecnico?.stripe_account_id && tecnico?.stripe_bonifici_attivi);
}

/**
 * Crea il conto del tecnico se non ce l'ha, e torna l'id.
 * Se ce l'ha gia', non ne crea un secondo: due conti per lo stesso tecnico
 * vorrebbero dire bonifici che finiscono su quello sbagliato.
 */
export async function assicuraConto(tecnico) {
  if (tecnico.stripe_account_id) return tecnico.stripe_account_id;

  const conto = await stripe.accounts.create(
    {
      type: "express",
      country: "IT",
      email: tecnico.email,
      business_type: "individual",
      capabilities: { transfers: { requested: true } },
      business_profile: {
        // 7623 = riparazione di elettrodomestici ed elettronica
        mcc: "7623",
        url: "https://fixiai.it",
        product_description: "Riparazione di elettrodomestici a domicilio",
      },
      metadata: { tecnico_id: String(tecnico.id) },
    },
    // Se la creazione va in timeout e il tecnico ricarica, questa chiave
    // impedisce che nasca un secondo conto.
    { idempotencyKey: chiaveIdempotenza("conto", tecnico.id) }
  );

  return conto.id;
}

/**
 * Il link su cui mandare il tecnico per compilare i suoi dati.
 * Dura pochi minuti ed e' usa e getta: si rigenera ogni volta.
 */
export async function linkConfigurazione(accountId, baseUrl, tokenTecnico) {
  const ritorno = `${baseUrl}/area-tecnico?token=${encodeURIComponent(tokenTecnico)}`;
  const link = await stripe.accountLinks.create({
    account: accountId,
    type: "account_onboarding",
    // Dove torna se il link e' scaduto mentre compilava: stessa pagina, che
    // gliene fara' generare uno nuovo.
    refresh_url: `${ritorno}&stripe=riprova`,
    return_url: `${ritorno}&stripe=fatto`,
  });
  return link.url;
}

/**
 * Rilegge da Stripe lo stato del conto.
 *
 * Non ci si fida di quello che il tecnico dice di aver compilato, e nemmeno
 * del fatto che sia tornato sul sito: Stripe puo' chiedere altri documenti
 * giorni dopo. La verita' e' solo qui.
 */
export async function leggiStatoConto(accountId) {
  const c = await stripe.accounts.retrieve(accountId);
  return {
    stripe_account_id: c.id,
    stripe_incassi_attivi: !!c.charges_enabled,
    stripe_bonifici_attivi: !!c.payouts_enabled,
    stripe_requisiti: {
      mancanti: c.requirements?.currently_due || [],
      in_scadenza: c.requirements?.eventually_due || [],
      in_verifica: c.requirements?.pending_verification || [],
      motivo_blocco: c.requirements?.disabled_reason || null,
    },
    stripe_aggiornato_at: new Date().toISOString(),
  };
}

/** Le tre parole da mostrare al tecnico. Niente gergo Stripe. */
export function comeStaIlConto(tecnico) {
  if (!tecnico?.stripe_account_id) return "non_configurato";
  if (tecnico.stripe_bonifici_attivi) return "attivo";
  return "incompleto";
}
