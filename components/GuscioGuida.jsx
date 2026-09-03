import Head from "next/head";

// Il guscio visivo delle pagine guida: testa, barra in alto, stile, piede.
//
// Nasce perche' le guide erano vistosamente piu' spoglie della landing, e
// chi arriva da Google atterra proprio li': vedeva un sito diverso da quello
// del titolo. Qui dentro stanno i colori, i caratteri e le proporzioni della
// home, cosi' le due meta' del sito sembrano la stessa cosa.
//
// ATTENZIONE al modo in cui il CSS viene passato: dangerouslySetInnerHTML e
// non <style>{`...`}</style>. Scritto in quel secondo modo React lo tratta
// come testo, sul server gli apostrofi dei nomi dei caratteri diventano
// codice HTML e nel browser no: le due versioni non combaciano, React scarta
// l'intera pagina costruita dal server e la ricostruisce da capo. E' successo
// davvero sulla home, ed e' rimasto nascosto per mesi.

export default function GuscioGuida({ titolo, descrizione, canonical, datiStrutturati, children }) {
  return (
    <>
      <Head>
        <title>{titolo}</title>
        <meta name="description" content={descrizione} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={titolo} />
        <meta property="og:description" content={descrizione} />
        <meta property="og:url" content={canonical} />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {datiStrutturati ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(datiStrutturati) }}
          />
        ) : null}
      </Head>

      <style dangerouslySetInnerHTML={{ __html: `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --verde: #1A6B50;
          --verde-chiaro: #2D9970;
          --verde-pallido: #EAF5EF;
          --crema: #FAF8F3;
          --inchiostro: #1C1C1A;
          --grigio: #6B6B68;
          --bordo: #E4E0D8;
          --ambra-fondo: #FDF6E8;
          --ambra-bordo: #EBD9AE;
          --ambra-testo: #7A5610;
        }

        body {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: var(--crema);
          color: var(--inchiostro);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .g-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 32px;
          padding-top: calc(16px + var(--safe-top, 0px));
          background: rgba(250, 248, 243, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--bordo);
        }

        .g-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 24px;
          color: var(--verde);
          text-decoration: none;
        }

        .g-nav-destra { display: flex; align-items: center; gap: 22px; }

        .g-nav-link {
          font-size: 14px;
          color: var(--grigio);
          text-decoration: none;
          transition: color 0.2s;
        }
        .g-nav-link:hover { color: var(--inchiostro); }

        .g-nav-cta {
          background: var(--verde);
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 20px;
          border-radius: 100px;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .g-nav-cta:hover { background: var(--verde-chiaro); }

        .g-main {
          max-width: 720px;
          margin: 0 auto;
          padding: 56px 24px 90px;
        }

        .g-briciole { font-size: 13px; color: var(--grigio); margin-bottom: 22px; }
        .g-briciole a { color: var(--grigio); text-decoration: none; }
        .g-briciole a:hover { color: var(--verde); text-decoration: underline; }

        .g-etichetta {
          display: inline-block;
          background: var(--verde-pallido);
          border: 1px solid rgba(26, 107, 80, 0.18);
          color: var(--verde);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 20px;
        }

        .g-titolo {
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          font-size: clamp(34px, 6vw, 48px);
          line-height: 1.12;
          letter-spacing: -0.5px;
          margin-bottom: 14px;
        }

        .g-meta { font-size: 13px; color: var(--grigio); margin-bottom: 34px; }

        .g-intro {
          font-size: 19px;
          line-height: 1.65;
          color: #3A3A37;
          margin-bottom: 30px;
        }

        .g-sezione {
          font-family: 'Instrument Serif', serif;
          font-weight: 400;
          font-size: 30px;
          line-height: 1.2;
          margin: 52px 0 22px;
        }

        .g-testo { font-size: 16.5px; line-height: 1.75; color: #3A3A37; }

        /* Riquadro sicurezza */
        .g-sicurezza {
          background: var(--ambra-fondo);
          border: 1px solid var(--ambra-bordo);
          border-radius: 14px;
          padding: 20px 22px;
          margin: 30px 0;
          font-size: 15.5px;
          line-height: 1.7;
          color: var(--ambra-testo);
        }
        .g-sicurezza strong { display: block; margin-bottom: 6px; color: #5E410A; }

        /* Passi numerati */
        .g-passo {
          display: grid;
          grid-template-columns: 38px 1fr;
          gap: 18px;
          padding: 24px 0;
          border-top: 1px solid var(--bordo);
        }
        .g-passo:first-of-type { border-top: none; padding-top: 4px; }

        .g-numero {
          font-family: 'Instrument Serif', serif;
          font-size: 26px;
          color: var(--verde);
          line-height: 1.1;
          opacity: 0.85;
        }

        .g-passo-titolo {
          font-size: 19px;
          font-weight: 600;
          line-height: 1.35;
          margin-bottom: 10px;
        }

        .g-difficolta {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          padding: 4px 11px;
          border-radius: 100px;
          margin-bottom: 10px;
        }
        .g-facile { background: #E2F1E8; color: #17603F; }
        .g-media { background: #FBEEDA; color: #855510; }
        .g-tecnico { background: #F6E4E4; color: #8B3030; }

        /* Elenco quando serve il tecnico */
        .g-elenco { list-style: none; margin-top: 4px; }
        .g-elenco li {
          position: relative;
          padding-left: 26px;
          margin-bottom: 12px;
          font-size: 16.5px;
          line-height: 1.65;
          color: #3A3A37;
        }
        .g-elenco li::before {
          content: '';
          position: absolute;
          left: 4px;
          top: 10px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--verde);
          opacity: 0.55;
        }

        /* Invito alla diagnosi */
        .g-cta {
          background: #fff;
          border: 1px solid var(--bordo);
          border-radius: 18px;
          padding: 30px;
          margin: 48px 0;
          box-shadow: 0 10px 34px rgba(26, 107, 80, 0.06);
        }
        .g-cta-titolo {
          font-family: 'Instrument Serif', serif;
          font-size: 26px;
          line-height: 1.25;
          margin-bottom: 12px;
        }
        .g-cta p { font-size: 16px; line-height: 1.7; color: var(--grigio); margin-bottom: 22px; }
        .g-bottone {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--verde);
          color: #fff;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          padding: 15px 30px;
          border-radius: 100px;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .g-bottone:hover {
          background: var(--verde-chiaro);
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(26, 107, 80, 0.22);
        }
        .g-garanzia { display: block; margin-top: 14px; font-size: 13.5px; color: var(--grigio); }

        /* Domande frequenti */
        .g-faq { border-top: 1px solid var(--bordo); padding: 22px 0; }
        .g-faq-domanda { font-size: 17px; font-weight: 600; margin-bottom: 8px; }

        /* Schede altre guide */
        .g-scheda {
          display: block;
          background: #fff;
          border: 1px solid var(--bordo);
          border-radius: 14px;
          padding: 18px 20px;
          margin-bottom: 12px;
          text-decoration: none;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .g-scheda:hover {
          border-color: rgba(26, 107, 80, 0.35);
          transform: translateY(-2px);
          box-shadow: 0 10px 26px rgba(26, 107, 80, 0.08);
        }
        .g-scheda-titolo { font-size: 17px; font-weight: 600; color: var(--verde); margin-bottom: 5px; line-height: 1.35; }
        .g-scheda-testo { font-size: 14.5px; color: var(--grigio); line-height: 1.6; }

        .g-gruppo {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--grigio);
          margin: 34px 0 14px;
        }

        .g-nota {
          margin-top: 44px;
          padding-top: 22px;
          border-top: 1px solid var(--bordo);
          font-size: 13.5px;
          line-height: 1.65;
          color: var(--grigio);
        }

        .g-piede {
          background: var(--inchiostro);
          color: rgba(255,255,255,0.55);
          padding: 34px 32px;
          padding-bottom: calc(34px + var(--safe-bottom, 0px));
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          font-size: 13.5px;
        }
        .g-piede-logo { font-family: 'Instrument Serif', serif; font-size: 22px; color: #fff; }
        .g-piede a { color: rgba(255,255,255,0.55); text-decoration: none; }
        .g-piede a:hover { color: #fff; }
        .g-piede-link { display: flex; gap: 16px; align-items: center; }

        @media (max-width: 640px) {
          .g-nav { padding: 14px 20px; padding-top: calc(14px + var(--safe-top, 0px)); }
          .g-nav-destra { gap: 14px; }
          .g-main { padding: 38px 20px 70px; }
          .g-intro { font-size: 17.5px; }
          .g-sezione { font-size: 26px; margin: 42px 0 18px; }
          .g-passo { grid-template-columns: 30px 1fr; gap: 14px; }
          .g-cta { padding: 24px 22px; }
          .g-piede { padding: 28px 20px; flex-direction: column; text-align: center; }
        }
      ` }} />

      <nav className="g-nav">
        <a href="/" className="g-logo">Fixi</a>
        <div className="g-nav-destra">
          <a href="/guida" className="g-nav-link">Guide</a>
          <a href="/diagnosi" className="g-nav-cta">Avvia diagnosi</a>
        </div>
      </nav>

      <main className="g-main">{children}</main>

      <footer className="g-piede">
        <div className="g-piede-logo">Fixi</div>
        <div>Diagnosi elettrodomestici via AI · fixiai.it</div>
        <div className="g-piede-link">
          <a href="/guida">Guide</a>
          <a href="/privacy">Privacy</a>
          <span>© 2026 Fixi</span>
        </div>
      </footer>
    </>
  );
}
