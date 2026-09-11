// lib/stripe-connect.js
// Il conto Stripe del tecnico: crearlo, farglielo compilare, sapere se e'
// pronto a ricevere soldi.
//
// Scritto seguendo le linee guida ufficiali di Stripe (.agents/skills/), non a
// memoria: l'11/09/2026 la prima versione usava le API vecchie e Stripe l'ha
// rifiutata. Le due regole che contano stanno qui sotto.
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  1. I SOLDI PASSANO DA FIXI E RESTANO FERMI FINCHE' IL LAVORO NON E'      │
// │     FINITO  ("separate charges and transfers")                            │
// │                                                                           │
// │  Stripe sa girare un incasso al destinatario nello stesso istante in cui  │
// │  il cliente paga. Qui non si puo', per due motivi che nascono dal         │
// │  modello e non da una preferenza:                                         │
// │                                                                           │
// │    - quando il cliente paga i 9,90 € della diagnosi il tecnico NON        │
// │      ESISTE ANCORA: non c'e' nessuna destinazione da scrivere;            │
// │    - il saldo si incassa PRIMA che il lavoro sia fatto. Se i soldi        │
// │      arrivassero subito al tecnico, un intervento mai eseguito si         │
// │      rimborserebbe solo chiedendoglieli indietro.                         │
// │                                                                           │
// │  Conseguenza pratica, ed e' una regola secca di Stripe: con questo        │
// │  schema la commissione NON si prende con application_fee_amount. Si       │
// │  trattiene trasferendo al tecnico MENO di quanto si e' incassato, che e'  │
// │  esattamente quello che calcola lib/soldi.js.                             │
// └───────────────────────────────────────────────────────────────────────────┘
//
// ┌───────────────────────────────────────────────────────────────────────────┐
// │  2. AL TECNICO SERVE SOLO "RECIPIENT"                                     │
// │                                                                           │
// │  Un conto Stripe puo' avere piu' ruoli: merchant (incassa carte proprie), │
// │  customer (paga), recipient (riceve soldi). Il tecnico deve solo          │
// │  ricevere: chiedere anche "merchant" gli allungherebbe l'iscrizione con   │
// │  verifiche che non gli servono, e qualcuno si fermerebbe a meta'.         │
// └───────────────────────────────────────────────────────────────────────────┘

import { stripe, chiaveIdempotenza } from "./stripe.js";

// Dove Stripe scrive se il tecnico puo' ricevere bonifici. E' un percorso
// lungo e va letto tutto: i vecchi campi payouts_enabled e charges_enabled
// esistono ancora ma su un conto v2 non dicono la verita'.
function statoTrasferimenti(conto) {
  return conto?.configuration?.recipient?.capabilities?.stripe_balance?.stripe_transfers?.status || null;
}

/** Il tecnico puo' essere pagato? Lo decide Stripe, non noi. */
export function puoEsserePagato(tecnico) {
  return Boolean(tecnico?.stripe_account_id && tecnico?.stripe_bonifici_attivi);
}

/**
 * Crea il conto del tecnico se non ce l'ha, e torna l'id.
 * Se ce l'ha gia' non ne crea un secondo: due conti per lo stesso tecnico
 * vorrebbero dire bonifici che finiscono su quello sbagliato.
 */
export async function assicuraConto(tecnico) {
  if (tecnico.stripe_account_id) return tecnico.stripe_account_id;

  const conto = await stripe.v2.core.accounts.create(
    {
      contact_email: tecnico.email,
      display_name: [tecnico.nome, tecnico.cognome].filter(Boolean).join(" ") || tecnico.email,
      identity: {
        country: "it",
        entity_type: "individual",
      },
      configuration: {
        recipient: {
          capabilities: { stripe_balance: { stripe_transfers: { requested: true } } },
        },
      },
      defaults: {
        responsibilities: {
          // "application" vuol dire Fixi. Deve essere Fixi per due ragioni: e'
          // Fixi a decidere il prezzo del servizio, e con le contestazioni
          // serve poter riprendere indietro un bonifico gia' partito.
          fees_collector: "application",
          losses_collector: "application",
        },
      },
      // Cruscotto ospitato da Stripe: il tecnico ci vede i suoi incassi senza
      // che Fixi debba costruire un'area pagamenti da zero.
      dashboard: "express",
      include: ["configuration.recipient", "identity", "requirements"],
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
 * Dura pochi minuti ed e' usa e getta: se ne genera uno nuovo ogni volta.
 */
export async function linkConfigurazione(accountId, baseUrl, tokenTecnico) {
  const ritorno = baseUrl + "/area-tecnico?token=" + encodeURIComponent(tokenTecnico);
  const link = await stripe.v2.core.accountLinks.create({
    account: accountId,
    use_case: {
      type: "account_onboarding",
      account_onboarding: {
        configurations: ["recipient"],
        refresh_url: ritorno + "&stripe=riprova",
        return_url: ritorno + "&stripe=fatto",
      },
    },
  });
  return link.url;
}

/**
 * Rilegge da Stripe lo stato del conto.
 *
 * Non ci si fida di quello che il tecnico dice di aver compilato, e nemmeno
 * del fatto che sia tornato sul sito: Stripe puo' chiedere altri documenti
 * giorni dopo. La verita' sta solo qui, e si rilegge prima di ogni bonifico.
 */
export async function leggiStatoConto(accountId) {
  const c = await stripe.v2.core.accounts.retrieve(accountId, {
    include: ["configuration.recipient", "requirements"],
  });
  const trasferimenti = statoTrasferimenti(c);

  return {
    stripe_account_id: c.id,
    // Su un conto "recipient" non esiste l'incasso carte: si tiene allineato
    // ai bonifici per non lasciare in giro un campo che non vuol dire niente.
    stripe_incassi_attivi: trasferimenti === "active",
    stripe_bonifici_attivi: trasferimenti === "active",
    stripe_requisiti: {
      trasferimenti,
      mancanti: (c.requirements?.entries || [])
        .filter((e) => e.awaiting_action || e.status === "currently_due")
        .map((e) => e.description || "dato richiesto")
        .slice(0, 10),
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
