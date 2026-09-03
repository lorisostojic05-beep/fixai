import { SITO } from "../lib/guide";

// Le istruzioni per i motori di ricerca. Prima non esisteva: /robots.txt
// rispondeva 404, e la riga più importante — dov'è la mappa del sito — non
// c'era da nessuna parte.
//
// Le pagine escluse non sono "segrete": chi conosce l'indirizzo ci arriva
// lo stesso, e infatti la sicurezza di /admin sta nel token, non qui.
// Escluderle serve solo a non far finire su Google roba che non è contenuto:
// un pannello di amministrazione indicizzato è brutto e attira tentativi.

function costruisciRobots() {
  return `User-agent: *
Allow: /

Disallow: /admin
Disallow: /api/
Disallow: /stato
Disallow: /accetta-lavoro
Disallow: /area-tecnico
Disallow: /recensione

Sitemap: ${SITO}/sitemap.xml
`;
}

export async function getServerSideProps({ res }) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400");
  res.write(costruisciRobots());
  res.end();
  return { props: {} };
}

export default function Robots() {
  return null;
}
