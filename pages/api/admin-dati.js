// pages/api/admin-dati.js
import { supabaseAdmin as supabase } from "../../lib/supabase-admin";
import { verificaTokenAdmin } from "../../lib/admin-token";

// Tariffe Claude Opus 5, in dollari per milione di token. Le quattro voci
// sono separate perché la cache ha prezzi suoi: scriverla costa 1,25 volte
// l'input, rileggerla un decimo. È lì che sta il risparmio del prompt lungo.
// Se un giorno si cambia modello, si aggiornano qui e basta.
const PREZZI = { input: 5, cacheWrite: 6.25, cacheRead: 0.5, output: 25 };

const costoDollari = (r) =>
  ((r.token_input || 0) * PREZZI.input +
    (r.token_cache_write || 0) * PREZZI.cacheWrite +
    (r.token_cache_read || 0) * PREZZI.cacheRead +
    (r.token_output || 0) * PREZZI.output) /
  1_000_000;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  if (!verificaTokenAdmin(req)) {
    return res.status(401).json({ error: "Non autorizzato" });
  }

  try {
    // Sessioni recenti
    const { data: tecniciInAttesa } = await supabase
  .from("tecnici")
  .select("*")
  .eq("approvato", false)
  .order("created_at", { ascending: false });
    // Elenco mostrato in dashboard: le ultime 20, complete di referto e chat
    const { data: sessioni } = await supabase
      .from("sessioni")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    // Statistiche su tutte le sessioni, non solo le ultime 20. Si prendono
    // solo le colonne che servono per non trascinarsi dietro referti e chat.
    const { data: perStatistiche } = await supabase
      .from("sessioni")
      .select("appliance, problem, feedback_voto, feedback_risolto, durata_secondi")
      .order("created_at", { ascending: false })
      .limit(500);
    const stat = perStatistiche || [];

    // Richieste di intervento, con il nome del tecnico assegnato
    const { data: richiesteRaw } = await supabase
      .from("richieste_intervento")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    let richieste = richiesteRaw || [];
    const idTecnici = [...new Set(richieste.filter((r) => r.tecnico_id).map((r) => r.tecnico_id))];
    if (idTecnici.length > 0) {
      const { data: tecniciAssegnati } = await supabase
        .from("tecnici")
        .select("id, nome, cognome, telefono")
        .in("id", idTecnici);
      const mappa = Object.fromEntries((tecniciAssegnati || []).map((t) => [t.id, t]));
      richieste = richieste.map((r) => ({ ...r, tecnico: mappa[r.tecnico_id] || null }));
    }

    // Consumo AI. Ogni riga di `pagamenti` è una diagnosi pagata, quindi il
    // costo di una riga è il costo di quella sessione.
    const { data: consumiRaw } = await supabase
      .from("pagamenti")
      .select("stripe_session_id, attivata_at, richieste, token_input, token_cache_write, token_cache_read, token_output")
      .order("attivata_at", { ascending: false })
      .limit(200);

    const consumi = (consumiRaw || [])
      .map((r) => ({
        id: (r.stripe_session_id || "").slice(-8), // basta la coda per riconoscerla
        data: r.attivata_at,
        messaggi: r.richieste || 0,
        token:
          (r.token_input || 0) + (r.token_cache_write || 0) +
          (r.token_cache_read || 0) + (r.token_output || 0),
        costo: costoDollari(r),
      }))
      .filter((c) => c.token > 0); // le diagnosi prima di questa modifica non hanno dati

    const costi = consumi.map((c) => c.costo);
    const consumoStat = {
      sessioni: costi.length,
      medio: costi.length ? costi.reduce((a, b) => a + b, 0) / costi.length : null,
      massimo: costi.length ? Math.max(...costi) : null,
      totale: costi.reduce((a, b) => a + b, 0),
    };

    // Statistiche
    const totale = stat.length;

    // Chi ha dato il voto: da quando la sessione si salva col referto, le due
    // cose non coincidono più — la differenza dice quanti non hanno valutato.
    const conFeedback = stat.filter(s => s.feedback_voto);
    const votoMedio = conFeedback.length > 0
      ? conFeedback.reduce((acc, s) => acc + s.feedback_voto, 0) / conFeedback.length
      : null;

    const conEsito = stat.filter(s => typeof s.feedback_risolto === "boolean");
    const risolti = conEsito.filter(s => s.feedback_risolto === true).length;
    const risoltiPercent = conEsito.length > 0
      ? Math.round((risolti / conEsito.length) * 100)
      : 0;

    const conDurata = stat.filter(s => s.durata_secondi);
    const duratMedia = conDurata.length > 0
      ? conDurata.reduce((acc, s) => acc + s.durata_secondi, 0) / conDurata.length
      : null;

    // Problemi più comuni
    const problemiMap = {};
    stat.forEach(s => {
      if (s.problem) {
        const key = s.problem.toLowerCase().trim();
        problemiMap[key] = (problemiMap[key] || 0) + 1;
      }
    });
    const problemiComuni = Object.entries(problemiMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([problema, count]) => ({ problema, count }));

    // Per elettrodomestico
    const elettroMap = {};
    stat.forEach(s => {
      if (s.appliance) {
        elettroMap[s.appliance] = (elettroMap[s.appliance] || 0) + 1;
      }
    });
    const perElettrodomestico = Object.entries(elettroMap)
      .sort((a, b) => b[1] - a[1])
      .map(([appliance, count]) => ({ appliance, count }));

    // Richieste di rimborso. Le più recenti in cima, e quelle ancora da
    // decidere vanno viste subito: dietro ognuna c'è qualcuno che aspetta
    // i suoi soldi, e farlo aspettare porta a uno storno bancario — che
    // costa più dei €9,90 e sporca il conto Stripe.
    const { data: rimborsiRaw } = await supabase
      .from("rimborsi")
      .select("id, created_at, email, motivo, stripe_session_id, sessione_token, appliance, brand, stato")
      .order("created_at", { ascending: false })
      .limit(50);

    // Ogni richiesta arriva con le PROVE accanto, se no la si giudica a naso.
    // Non servono a smascherare nessuno: servono a rendere ovvi i casi ovvi.
    // La più forte è la contraddizione col voto: chi ha appena messo 5 stelle
    // e "risolto da solo", e due minuti dopo scrive che non gli è servita, si
    // è contraddetto per iscritto — e quel voto lo aveva dato prima di sapere
    // che esisteva un rimborso, perché il link sta sotto.
    const rimborsi = await Promise.all(
      (rimborsiRaw || []).map(async (r) => {
        const prove = {};
        if (r.sessione_token) {
          const { data: s } = await supabase
            .from("sessioni")
            .select("created_at, feedback_voto, feedback_risolto, durata_secondi, email_utente, report, messages")
            .eq("token", r.sessione_token)
            .maybeSingle();
          if (s) {
            prove.voto = s.feedback_voto;
            prove.risolto = s.feedback_risolto;
            prove.durataMin = s.durata_secondi ? Math.round(s.durata_secondi / 60) : null;
            prove.refertoPerEmail = !!s.email_utente;
            prove.diagnosi = s.report?.diagnosis || null;
            prove.pezzo = s.report?.sparePart?.name || null;
            prove.messaggiScambiati = Array.isArray(s.messages) ? s.messages.length : null;
            prove.giorniDopo = s.created_at
              ? Math.round((new Date(r.created_at) - new Date(s.created_at)) / 86400000)
              : null;
          }
        }
        if (r.stripe_session_id) {
          const { data: pag } = await supabase
            .from("pagamenti")
            .select("richieste")
            .eq("stripe_session_id", r.stripe_session_id)
            .maybeSingle();
          prove.richiesteAI = pag?.richieste ?? null;
        }
        // Ha usato il referto per farsi mandare un tecnico? Allora gli è
        // servito. Si collega per email: le due tabelle non hanno altro in
        // comune, quindi vale solo se ha usato lo stesso indirizzo.
        const { data: interventi } = await supabase
          .from("richieste_intervento")
          .select("id")
          .eq("email", r.email)
          .limit(1);
        prove.haChiestoTecnico = (interventi?.length || 0) > 0;

        return { ...r, prove };
      })
    );

    return res.status(200).json({
      rimborsi,
      rimborsiDaDecidere: rimborsi.filter((r) => r.stato === "richiesto").length,

      // Che chiavi Stripe sta usando DAVVERO il server, adesso. Nasce dal
      // passaggio alla modalità reale del 30/08/2026: le variabili su Vercel
      // sembravano cambiate ma il sito continuava a creare sessioni di prova,
      // e non c'era modo di sapere se il problema fosse la variabile o il
      // deploy. Qui si vede in un colpo d'occhio.
      //
      // Solo il PREFISSO: "sk_live" o "sk_test", mai il resto della chiave.
      // Anche se questo endpoint è protetto, una chiave segreta non va
      // spedita fuori dal server nemmeno a chi ha la password.
      stripe: {
        segreta: (process.env.STRIPE_SECRET_KEY || "").slice(0, 7) || "(mancante)",
        pubblica: (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "").slice(0, 7) || "(mancante)",
      },
      totale,
      votate: conFeedback.length,
      votoMedio,
      risoltiPercent,
      duratMedia,
      problemiComuni,
      perElettrodomestico,
      sessioni: sessioni || [],
      tecniciInAttesa: tecniciInAttesa || [],
      richieste,
      consumi: consumi.slice(0, 20),
      consumoStat,
    });
  } catch (err) {
    console.error("Errore admin dati:", err);
    return res.status(500).json({ error: err.message });
  }
}