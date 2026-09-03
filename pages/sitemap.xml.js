import { tutteLeGuide, SITO } from "../lib/guide";

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

const PAGINE_FISSE = [
  { percorso: "/", priorita: "1.0", frequenza: "weekly" },
  { percorso: "/guida", priorita: "0.8", frequenza: "weekly" },
  { percorso: "/iscriviti-tecnico", priorita: "0.5", frequenza: "monthly" },
  { percorso: "/privacy", priorita: "0.3", frequenza: "yearly" },
];

function costruisciSitemap() {
  const oggi = new Date().toISOString().slice(0, 10);

  const voci = [
    ...PAGINE_FISSE.map((p) => ({
      url: `${SITO}${p.percorso}`,
      data: oggi,
      frequenza: p.frequenza,
      priorita: p.priorita,
    })),
    ...tutteLeGuide().map((g) => ({
      url: `${SITO}/guida/${g.slug}`,
      data: g.aggiornata,
      frequenza: "monthly",
      priorita: "0.9",
    })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${voci
  .map(
    (v) => `  <url>
    <loc>${v.url}</loc>
    <lastmod>${v.data}</lastmod>
    <changefreq>${v.frequenza}</changefreq>
    <priority>${v.priorita}</priority>
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
