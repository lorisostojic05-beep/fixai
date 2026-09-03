import Head from "next/head";

// Gestione della barra di stato sui telefoni.
//
// Da Android 16 le app non possono più rinunciare al disegno "bordo a bordo":
// l'impostazione windowOptOutEdgeToEdgeEnforcement, che usavamo per Android 15,
// viene ignorata. Senza contromisure il contenuto finirebbe sotto la barra di
// stato, come succedeva prima della correzione di luglio.
//
// La soluzione sta qui, nel sito, e non nell'app: "viewport-fit=cover" attiva
// le variabili env(safe-area-inset-*), che il sistema riempie con l'altezza
// reale delle barre. Le rendiamo disponibili come --safe-top / --safe-bottom
// così ogni schermata può tenerne conto.
//
// Nei browser normali e su Android 15 quei valori sono 0: questa pagina non
// cambia nulla finché non serve davvero.
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {/* Verifica di Google Search Console: dimostra a Google che il sito
            e' nostro, e ci da' accesso a cosa cerca la gente per arrivarci.
            Non e' un segreto — sta nell'HTML pubblico di ogni pagina, e
            serve solo a quello. Va lasciato per sempre: se sparisce, Google
            toglie la verifica e con essa l'accesso ai dati. */}
        <meta
          name="google-site-verification"
          content="v35zw8dzYKk6k1sZnl93jAb9CCpVbt_DR5qiZxWKjEk"
        />
      </Head>

      <style jsx global>{`
        :root {
          --safe-top: env(safe-area-inset-top, 0px);
          --safe-bottom: env(safe-area-inset-bottom, 0px);
        }
        body {
          padding-top: var(--safe-top);
          padding-bottom: var(--safe-bottom);
        }
      `}</style>

      <Component {...pageProps} />
    </>
  );
}
