import { tutteLeGuide, elettrodomesticiConGuide, SITO } from "../lib/guide";
import { LINGUE, PREDEFINITA } from "../lib/lingue";

// La mappa del sito: l'elenco delle pagine che vogliamo su Google.
//
// Fino a settembre 2026 il sito non ne aveva una, e /sitemap.xml rispondeva
// 404. Senza, Google deve scoprire le pagine seguendo i link a caso; con,
// gliele si consegna in un file solo, e sa subito quando cambiano.
//
// È generata al volo dai dati, non scritta a mano: aggiungere una guida in
// lib/guide.js la fa comparire qui senza che nessuno se ne debba ricordare —
// che è esattamente il tipo di passaggio che si dimentica.
//
// Nota: /diagnosi e /stato non ci sono di proposito. La prima è uno strumento
// che vive dietro un pagamento, la seconda è una pagina di servizio: nessuna
// delle due ha senso come risultato di ricerca.

// La home c'e' in sette lingue e sta a parte: ha bisogno delle righe hreflang
// che dicono a Google che le sette pagine sono la stessa cosa tradotta.
// Le altre esistono solo in italiano — le guide perche' non sono ancora
// tradotte (vedi LINGUE_CON_GUIDE), le pagine di servizio perche' non ha senso.
const PAGINE_FISSE = [
  { percorso: "/guida", priorita: "0.8", frequenza: "weekly" },
  { percorso: "/iscriviti-tecnico", priorita: "0.5", frequenza: "monthly" },
  { percorso: "/privacy", priorita: "0.3", frequenza: "yearly" },
];

// L'italiano non ha prefisso, le altre lingue si': la stessa regola degli
// indirizzi veri, decisa da defaultLocale in next.config.js.
const home = (codice) => (codice === PREDEFINITA ? `${SITO}/` : `${SITO}/${codice}`);

function costruisciSitemap() {
  const oggi = new Date().toISOString().slice(0, 10);

  // Ogni versione della home elenca tutte le altre, se stessa compresa: e' cosi'
  // che vuole Google, e se una sola delle sette non lo facesse le romperebbe tutte.
  const alternativeHome = LINGUE.map((l) => ({ lingua: l.codice, url: home(l.codice) }));

  const voci = [
    ...LINGUE.map((l) => ({
      url: home(l.codice),
      data: oggi,
      frequenza: "weekly",
      priorita: "1.0",
      alternative: alternativeHome,
    })),
    ...PAGINE_FISSE.map((p) => ({
      url: `${SITO}${p.percorso}`,
      data: oggi,
      frequenza: p.frequenza,
      priorita: p.priorita,
    })),
    // Le pagine di secondo livello, una per elettrodomestico. Solo quelle
    // che hanno almeno una guida: le altre non esistono nemmeno.
    ...elettrodomesticiConGuide()
      .filter((e) => e.quante > 0)
      .map((e) => ({
        url: `${SITO}/guida/${e.nome}`,
        data: oggi,
        frequenza: "weekly",
        priorita: "0.7",
      })),
    ...tutteLeGuide().map((g) => ({
      url: `${SITO}/guida/${g.elettrodomestico}/${g.slug}`,
      data: g.aggiornata,
      frequenza: "monthly",
      priorita: "0.9",
    })),
  ];

  const righeAlternative = (v) =>
    (v.alternative || [])
      .map(
        (a) =>
          `\n    <xhtml:link rel="alternate" hreflang="${a.lingua}" href="${a.url}"/>`
      )
      .join("") +
    (v.alternative
      ? `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${home(PREDEFINITA)}"/>`
      : "");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${voci
  .map(
    (v) => `  <url>
    <loc>${v.url}</loc>
    <lastmod>${v.data}</lastmod>
    <changefreq>${v.frequenza}</changefreq>
    <priority>${v.priorita}</priority>${righeAlternative(v)}
  </url>`
  )
  .join("\n")}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600");
  res.write(costruisciSitemap());
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
