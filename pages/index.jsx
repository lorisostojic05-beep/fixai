import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import SceltaLingua from "../components/SceltaLingua";
import { testiPer } from "../lib/testi";
import { guideDisponibiliIn, LINGUE, PREDEFINITA } from "../lib/lingue";
import { SITO } from "../lib/guide";

// L'indirizzo di una lingua: l'italiano non ha prefisso (fixiai.it), le altre
// si', ed e' la stessa regola che applica Next.js agli indirizzi veri.
const indirizzo = (codice) => (codice === PREDEFINITA ? `${SITO}/` : `${SITO}/${codice}`);

// Le parole arrivano gia' scelte dal server: cosi' il browser scarica solo la
// lingua che serve. Il perche' per esteso sta in lib/testi.js.
export async function getStaticProps({ locale }) {
  return {
    props: {
      testi: testiPer(locale),
      // Le guide esistono solo in italiano: vedi LINGUE_CON_GUIDE in
      // lib/lingue.js. Dove non ci sono, il collegamento non si mostra —
      // altrimenti manderebbe a una pagina che risponde 404.
      guide: guideDisponibiliIn(locale),
      canonical: indirizzo(locale),
      alternative: LINGUE.map((l) => ({ lingua: l.codice, url: indirizzo(l.codice) })),
    },
  };
}

// Tutte le parole di questa pagina stanno in testi/<lingua>.js. Qui dentro
// restano solo impaginazione e comportamento — vedi il commento in testi/it.js.
export default function Home({ testi: t, guide, canonical, alternative }) {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible((prev) => ({ ...prev, [e.target.dataset.id]: true }));
          }
        });
      },
      { threshold: 0.15 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (id) => (el) => {
    sectionRefs.current[id] = el;
    if (el) el.dataset.id = id;
  };

  return (
    <>
      <Head>
        <title>{t.meta.titolo}</title>
        <meta name="description" content={t.meta.descrizione} />

        {/* Senza queste righe, Google vede sette pagine diverse e non sa che
            sono la stessa cosa in sette lingue: sceglie da solo quale mostrare,
            e puo' proporre l'italiano a uno spagnolo. Con hreflang mostra a
            ciascuno la sua, e nessuna delle sette ruba visibilita' alle altre.
            x-default e' la risposta a "e per tutti gli altri?": l'italiano,
            perche' e' la versione che esiste da piu' tempo ed e' l'unica con
            le guide dietro. */}
        <link rel="canonical" href={canonical} />
        {alternative.map((a) => (
          <link key={a.lingua} rel="alternate" hrefLang={a.lingua} href={a.url} />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={alternative.find((a) => a.lingua === "it").url}
        />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      {/* Il CSS va passato cosi, e non come <style>{`...`}</style>.
          Scritto in quel modo React lo tratta come testo e sul server gli
          apostrofi di 'DM Sans' diventano &#x27;, mentre nel browser restano
          apostrofi: le due versioni non combaciano, l'idratazione fallisce e
          React butta via l'intera pagina costruita dal server per rifarla da
          capo nel browser. La pagina si vedeva lo stesso, ma pagando una
          ricostruzione completa a ogni visita. */}
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
        }

        html { scroll-behavior: smooth; }
        
        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--crema);
          color: var(--inchiostro);
          overflow-x: hidden;
        }

        .serif { font-family: 'Instrument Serif', serif; }

        /* NAV */
        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 20px 48px;
          /* La barra è fissata in cima, quindi non segue la spaziatura del
             corpo pagina: lo spazio per la barra di stato va aggiunto qui. */
          padding-top: calc(20px + var(--safe-top, 0px));
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.3s;
        }

        nav.scrolled {
          background: rgba(250, 248, 243, 0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--bordo);
          padding: 14px 48px;
          padding-top: calc(14px + var(--safe-top, 0px));
        }

        .nav-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 24px;
          color: var(--verde);
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
        }

        .nav-links a {
          font-size: 14px;
          color: var(--grigio);
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--inchiostro); }

        .btn-nav {
          background: var(--verde);
          color: white !important;
          padding: 10px 22px;
          border-radius: 100px;
          font-size: 14px !important;
          font-weight: 500;
          transition: background 0.2s !important;
        }
        .btn-nav:hover { background: var(--verde-chiaro) !important; }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 48px 80px;
          position: relative;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse 60% 50% at 70% 40%, rgba(26, 107, 80, 0.08) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 20% 80%, rgba(26, 107, 80, 0.05) 0%, transparent 70%);
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          position: relative;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--verde-pallido);
          border: 1px solid rgba(26, 107, 80, 0.2);
          color: var(--verde);
          font-size: 12px;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 28px;
          letter-spacing: 0.3px;
        }

        .hero-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(48px, 5vw, 72px);
          line-height: 1.05;
          color: var(--inchiostro);
          margin-bottom: 24px;
        }

        .hero-title em {
          font-style: italic;
          color: var(--verde);
        }

        .hero-sub {
          font-size: 18px;
          color: var(--grigio);
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 420px;
        }

        .hero-cta {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .btn-primary {
          background: var(--verde);
          color: white;
          padding: 16px 32px;
          border-radius: 100px;
          font-size: 15px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-primary:hover {
          background: var(--verde-chiaro);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(26, 107, 80, 0.25);
        }

        .btn-ghost {
          color: var(--grigio);
          font-size: 14px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }
        .btn-ghost:hover { color: var(--inchiostro); }

        .hero-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .phone-mock {
          width: 260px;
          background: var(--inchiostro);
          border-radius: 36px;
          padding: 12px;
          box-shadow: 
            0 40px 80px rgba(0,0,0,0.2),
            0 0 0 1px rgba(255,255,255,0.05);
          position: relative;
          z-index: 2;
        }

        .phone-screen {
          background: #1A1A18;
          border-radius: 28px;
          overflow: hidden;
          aspect-ratio: 9/19;
          display: flex;
          flex-direction: column;
        }

        .phone-header {
          background: #0F6E56;
          padding: 14px 16px 10px;
        }

        .phone-logo {
          font-family: 'Instrument Serif', serif;
          color: white;
          font-size: 16px;
        }

        .phone-subtitle {
          color: rgba(255,255,255,0.6);
          font-size: 10px;
          margin-top: 2px;
        }

        .phone-video {
          background: #2A2A28;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .phone-video-icon {
          font-size: 32px;
          opacity: 0.4;
        }

        .phone-ai-label {
          position: absolute;
          top: 8px; left: 8px;
          background: #0F6E56;
          color: white;
          font-size: 9px;
          padding: 3px 8px;
          border-radius: 100px;
        }

        .phone-chat {
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: #1A1A18;
        }

        .bubble-ai {
          background: #2A2A28;
          color: #E0E0DC;
          font-size: 9px;
          padding: 7px 10px;
          border-radius: 10px 10px 10px 3px;
          max-width: 85%;
          line-height: 1.4;
        }

        .bubble-user {
          background: #0F6E56;
          color: white;
          font-size: 9px;
          padding: 7px 10px;
          border-radius: 10px 10px 3px 10px;
          max-width: 75%;
          align-self: flex-end;
          line-height: 1.4;
        }

        .phone-float-card {
          position: absolute;
          background: white;
          border-radius: 16px;
          padding: 14px 18px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          font-size: 12px;
          z-index: 3;
        }

        .float-left {
          left: -60px;
          bottom: 80px;
        }

        .float-right {
          right: -50px;
          top: 100px;
        }

        .float-label {
          color: var(--grigio);
          font-size: 10px;
          margin-bottom: 4px;
        }

        .float-value {
          font-weight: 600;
          color: var(--inchiostro);
        }

        .float-green { color: var(--verde); }

        /* STATS BAR */
        .stats-bar {
          border-top: 1px solid var(--bordo);
          border-bottom: 1px solid var(--bordo);
          padding: 32px 48px;
          display: flex;
          justify-content: center;
          gap: 80px;
          background: white;
        }

        .stat-item {
          text-align: center;
        }

        .stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 36px;
          color: var(--verde);
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 13px;
          color: var(--grigio);
        }

        /* SEZIONI GENERALI */
        section {
          padding: 100px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-tag {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--verde);
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(36px, 4vw, 52px);
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .section-sub {
          font-size: 17px;
          color: var(--grigio);
          line-height: 1.6;
          max-width: 520px;
        }

        /* COME FUNZIONA */
        .steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-top: 60px;
        }

        .step {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .step.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .step:nth-child(2) { transition-delay: 0.1s; }
        .step:nth-child(3) { transition-delay: 0.2s; }
        .step:nth-child(4) { transition-delay: 0.3s; }

        .step-num {
          font-family: 'Instrument Serif', serif;
          font-size: 48px;
          color: var(--bordo);
          line-height: 1;
          margin-bottom: 16px;
        }

        .step-icon {
          font-size: 28px;
          margin-bottom: 12px;
        }

        .step h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .step p {
          font-size: 14px;
          color: var(--grigio);
          line-height: 1.6;
        }

        /* PERCHÉ FIXI */
        .why-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          margin-top: 60px;
        }

        .why-list {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .why-item {
          display: flex;
          gap: 16px;
          opacity: 0;
          transform: translateX(-20px);
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .why-item.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .why-item:nth-child(2) { transition-delay: 0.1s; }
        .why-item:nth-child(3) { transition-delay: 0.2s; }
        .why-item:nth-child(4) { transition-delay: 0.3s; }

        .why-icon {
          width: 44px;
          height: 44px;
          background: var(--verde-pallido);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .why-text h3 {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .why-text p {
          font-size: 14px;
          color: var(--grigio);
          line-height: 1.5;
        }

        .why-visual {
          background: white;
          border-radius: 24px;
          padding: 32px;
          border: 1px solid var(--bordo);
        }

        .referto-mock {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .referto-row {
          background: var(--crema);
          border-radius: 12px;
          padding: 14px 16px;
          border-left: 3px solid var(--verde);
        }

        .referto-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--verde);
          font-weight: 600;
          margin-bottom: 4px;
        }

        .referto-value {
          font-size: 13px;
          color: var(--inchiostro);
          line-height: 1.4;
        }

        .referto-price {
          font-size: 24px;
          font-family: 'Instrument Serif', serif;
          color: var(--verde);
        }

        /* PREZZI */
        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 60px;
          max-width: 700px;
        }

        .price-card {
          background: white;
          border: 1px solid var(--bordo);
          border-radius: 20px;
          padding: 32px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .price-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .price-card:nth-child(2) { transition-delay: 0.15s; }

        .price-card.featured {
          border: 2px solid var(--verde);
          position: relative;
        }

        .price-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--verde);
          color: white;
          font-size: 11px;
          font-weight: 500;
          padding: 4px 14px;
          border-radius: 100px;
          white-space: nowrap;
        }

        .price-name {
          font-size: 14px;
          color: var(--grigio);
          margin-bottom: 8px;
        }

        .price-amount {
          font-family: 'Instrument Serif', serif;
          font-size: 48px;
          color: var(--inchiostro);
          line-height: 1;
          margin-bottom: 4px;
        }

        .price-amount sup {
          font-size: 20px;
          vertical-align: top;
          margin-top: 8px;
          display: inline-block;
        }

        .price-period {
          font-size: 13px;
          color: var(--grigio);
          margin-bottom: 24px;
        }

        .price-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .price-features li {
          font-size: 13px;
          color: var(--grigio);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .price-features li::before {
          content: "✓";
          color: var(--verde);
          font-weight: 600;
        }

        /* TECNICI */
        .tecnici-section {
          background: var(--inchiostro);
          color: white;
          padding: 100px 48px;
        }

        .tecnici-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .tecnici-section .section-tag { color: #5DCAA5; }
        .tecnici-section .section-title { color: white; }
        .tecnici-section .section-sub { color: rgba(255,255,255,0.6); }

        .tecnici-benefits {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 40px;
        }

        .tecnici-benefit {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .tecnici-benefit-icon {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.08);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .tecnici-benefit h3 {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 2px;
          color: white;
        }

        .tecnici-benefit p {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
        }

        .tecnici-cta {
          margin-top: 40px;
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .btn-white {
          background: white;
          color: var(--inchiostro);
          padding: 14px 28px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-white:hover { background: var(--crema); }

        .btn-ghost-white {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          text-decoration: none;
          transition: color 0.2s;
        }
        .btn-ghost-white:hover { color: white; }

        .tecnici-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .tecnici-stat {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 24px;
        }

        .tecnici-stat-num {
          font-family: 'Instrument Serif', serif;
          font-size: 36px;
          color: #5DCAA5;
          margin-bottom: 4px;
        }

        .tecnici-stat-label {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }

        /* CTA FINALE */
        .cta-final {
          text-align: center;
          padding: 120px 48px;
          background: var(--verde-pallido);
          border-top: 1px solid rgba(26, 107, 80, 0.1);
        }

        .cta-final .section-title {
          max-width: 600px;
          margin: 0 auto 24px;
        }

        .cta-final .section-sub {
          max-width: 400px;
          margin: 0 auto 40px;
        }

        /* FOOTER */
        footer {
          background: var(--inchiostro);
          color: rgba(255,255,255,0.4);
          padding: 40px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .footer-logo {
          font-family: 'Instrument Serif', serif;
          font-size: 20px;
          color: white;
        }

        /* ANIMAZIONI ENTRATA */
        .fade-up {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          nav { padding: 16px 20px; }
          nav.scrolled { padding: 12px 20px; }
          /* Su mobile mostra solo logo + pulsante: le sezioni si raggiungono scorrendo */
          .nav-links { gap: 0; }
          .nav-links li:not(:last-child) { display: none; }
          /* Le guide sono un eccezione: restano visibili anche sul telefono,
             perche chi cerca il sintomo della sua lavatrice lo fa quasi
             sempre dal cellulare, in piedi davanti alla macchina. Nasconderle
             proprio sul dispositivo del loro pubblico sarebbe il contrario di
             quello che servono.
             Sul telefono resta da sola accanto al pulsante verde, e in grigio
             sparirebbe: diventa una pillola col bordo, cosi si legge come un
             secondo pulsante invece che come una scritta di servizio. */
          .nav-links li.nav-guide { display: block; margin-right: 10px; }
          .nav-links li.nav-guide a {
            color: var(--verde);
            font-weight: 500;
            border: 1px solid rgba(26, 107, 80, 0.35);
            padding: 9px 16px;
            border-radius: 100px;
          }
          /* Anche la lingua resta visibile sul telefono, e per un motivo piu'
             forte delle guide: dentro l'app la barra in alto e' l'unico posto
             dove esiste: se sparisce qui, chi ha il telefono in una lingua e
             ne vuole un'altra non ha nessun modo di cambiarla. */
          .nav-links li.nav-lingua { display: block; margin-right: 10px; }
          .btn-nav { padding: 9px 18px; white-space: nowrap; }
          .hero { padding: 100px 24px 60px; }
          .hero-grid { grid-template-columns: 1fr; gap: 48px; }
          .hero-visual { display: none; }
          .stats-bar { padding: 24px; gap: 32px; flex-wrap: wrap; }
          section { padding: 60px 24px; }
          .steps { grid-template-columns: 1fr 1fr; }
          .why-grid { grid-template-columns: 1fr; }
          .pricing-grid { grid-template-columns: 1fr; }
          .tecnici-section { padding: 60px 24px; }
          .tecnici-inner { grid-template-columns: 1fr; gap: 48px; }
          .cta-final { padding: 80px 24px; }
          footer { flex-direction: column; gap: 16px; text-align: center; }
        }
      ` }} />

      {/* NAV */}
      <nav className={scrollY > 50 ? "scrolled" : ""}>
        <a href="/" className="nav-logo">Fixi</a>
        <ul className="nav-links">
          <li><a href="#come-funziona">{t.nav.comeFunziona}</a></li>
          {/* Le guide stanno nel menu, non solo nel footer. Chi arriva non e'
              sempre pronto a pagare subito: se non ha niente da leggere se ne
              va, mentre chi prova da solo e non ce la fa arriva alla diagnosi
              gia' convinto. E' il percorso vero — problema, tentativo, resa —
              e prima il sito offriva solo l'ultimo passo. */}
          {guide ? <li className="nav-guide"><a href="/guida">{t.nav.guide}</a></li> : null}
          <li><a href="#prezzi">{t.nav.prezzi}</a></li>
          <li><a href="#tecnici">{t.nav.tecnici}</a></li>
          {/* Il tasto della lingua sta prima del pulsante verde e non dopo:
              in fondo alla barra ci va la cosa che vogliamo far cliccare. */}
          <li className="nav-lingua"><SceltaLingua testi={t.lingua} /></li>
          <li><a href="/diagnosi" className="btn-nav">{t.nav.avvia}</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-grid">
          <div>
            <div className="hero-badge">
              <span>✦</span> {t.hero.badge}
            </div>
            <h1 className="hero-title">
              {t.hero.titolo1}<br />
              <em>{t.hero.titolo2}</em>
            </h1>
            <p className="hero-sub">
              {t.hero.sottotitolo}
            </p>
            <div className="hero-cta">
              <a href="/diagnosi" className="btn-primary">
                {t.hero.avvia} →
              </a>
              <a href="#come-funziona" className="btn-ghost">
                {t.hero.comeFunziona} ↓
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="phone-mock">
              <div className="phone-screen">
                <div className="phone-header">
                  <div className="phone-logo">Fixi</div>
                  <div className="phone-subtitle">{t.telefono.sessione} · 00:03:24</div>
                </div>
                <div className="phone-video">
                  <span className="phone-video-icon">📷</span>
                  <div className="phone-ai-label">{t.telefono.analizza} ▸</div>
                </div>
                <div className="phone-chat">
                  <div className="bubble-ai">{t.telefono.bolla1}</div>
                  <div className="bubble-user">{t.telefono.bolla2}</div>
                  <div className="bubble-ai">{t.telefono.bolla3}</div>
                </div>
              </div>
            </div>

            <div className="phone-float-card float-left">
              <div className="float-label">{t.telefono.risparmioEtichetta}</div>
              <div className="float-value float-green">{t.telefono.risparmioValore}</div>
            </div>

            <div className="phone-float-card float-right">
              <div className="float-label">{t.telefono.problemaEtichetta}</div>
              <div className="float-value">{t.telefono.problemaValore} ✓</div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-bar">
        {t.numeri.map((s, i) => (
          <div className="stat-item" key={i}>
            <div className="stat-num">{s.valore}</div>
            <div className="stat-label">{s.etichetta}</div>
          </div>
        ))}
      </div>

      {/* COME FUNZIONA */}
      <section id="come-funziona">
        <div ref={addRef("steps-title")} className={`fade-up ${visible["steps-title"] ? "visible" : ""}`}>
          <div className="section-tag">{t.passi.tag}</div>
          <h2 className="section-title">{t.passi.titolo1}<br />{t.passi.titolo2}</h2>
          <p className="section-sub">{t.passi.sottotitolo}</p>
        </div>

        <div className="steps">
          {/* Numeri e icone restano qui: non sono lingua, e ogni cosa che non
              passa dal file dei testi e' una cosa che la traduzione non puo'
              rompere. Il testo arriva da t.passi.elenco, nello stesso ordine. */}
          {[
            { num: "01", icon: "📱" },
            { num: "02", icon: "💳" },
            { num: "03", icon: "🎥" },
            { num: "04", icon: "📋" },
          ].map(({ num, icon }, i) => ({ num, icon, ...t.passi.elenco[i] })).map((s, i) => (
            <div
              key={i}
              ref={addRef(`step-${i}`)}
              className={`step ${visible[`step-${i}`] ? "visible" : ""}`}
            >
              <div className="step-num">{s.num}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.titolo}</h3>
              <p>{s.testo}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PERCHÉ FIXI */}
      <section id="perche">
        <div className="why-grid">
          <div>
            <div ref={addRef("why-title")} className={`fade-up ${visible["why-title"] ? "visible" : ""}`}>
              <div className="section-tag">{t.perche.tag}</div>
              <h2 className="section-title">{t.perche.titolo1}<br />{t.perche.titolo2}</h2>
            </div>

            <div className="why-list">
              {["🔍", "🛠️", "📄", "🌍"].map((icon, i) => ({ icon, ...t.perche.elenco[i] })).map((w, i) => (
                <div
                  key={i}
                  ref={addRef(`why-${i}`)}
                  className={`why-item ${visible[`why-${i}`] ? "visible" : ""}`}
                >
                  <div className="why-icon">{w.icon}</div>
                  <div className="why-text">
                    <h3>{w.titolo}</h3>
                    <p>{w.testo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div ref={addRef("why-visual")} className={`fade-up ${visible["why-visual"] ? "visible" : ""}`}>
            <div className="why-visual">
              <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--grigio)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
                {t.perche.esempioTitolo}
              </div>
              <div className="referto-mock">
                <div className="referto-row">
                  <div className="referto-label">{t.perche.referto.diagnosiEtichetta}</div>
                  <div className="referto-value">{t.perche.referto.diagnosiValore}</div>
                </div>
                <div className="referto-row" style={{ borderColor: "#2D9970" }}>
                  <div className="referto-label" style={{ color: "#2D9970" }}>{t.perche.referto.soluzioneEtichetta}</div>
                  <div className="referto-value">{t.perche.referto.soluzioneValore}</div>
                </div>
                <div className="referto-row" style={{ borderColor: "#854F0B", background: "#FFFBF2" }}>
                  <div className="referto-label" style={{ color: "#854F0B" }}>{t.perche.referto.tecnicoEtichetta}</div>
                  <div className="referto-value">{t.perche.referto.tecnicoValore}</div>
                </div>
                <div className="referto-row" style={{ borderColor: "#185FA5", background: "#F0F6FF" }}>
                  <div className="referto-label" style={{ color: "#185FA5" }}>{t.perche.referto.costoEtichetta}</div>
                  <div className="referto-price">{t.perche.referto.costoValore}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PREZZI */}
      <section id="prezzi" style={{ background: "white", maxWidth: "100%", padding: "100px 48px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div ref={addRef("pricing-title")} className={`fade-up ${visible["pricing-title"] ? "visible" : ""}`}>
            <div className="section-tag">{t.prezzi.tag}</div>
            <h2 className="section-title">{t.prezzi.titolo}</h2>
            <p className="section-sub">{t.prezzi.sottotitolo}</p>
          </div>

          <div style={{ maxWidth: "380px", marginTop: "60px" }}>
            <a
              href="/diagnosi"
              ref={addRef("price-1")}
              className={`price-card ${visible["price-1"] ? "visible" : ""}`}
              style={{ display: "block", textDecoration: "none", color: "inherit", cursor: "pointer" }}
            >
              <div className="price-name">{t.prezzi.nome}</div>
              <div className="price-amount">
                <sup>{t.prezzi.importoValuta}</sup>{t.prezzi.importoIntero}<sup>{t.prezzi.importoCentesimi}</sup>
              </div>
              <div className="price-period">{t.prezzi.periodo}</div>
              <ul className="price-features">
                {t.prezzi.caratteristiche.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
              <div style={{ marginTop: "24px", background: "var(--verde)", color: "white", textAlign: "center", padding: "13px", borderRadius: "100px", fontWeight: 500, fontSize: "15px" }}>
                {t.prezzi.avvia} →
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* TECNICI */}
      <div className="tecnici-section" id="tecnici">
        <div className="tecnici-inner">
          <div>
            <div className="section-tag">{t.tecnici.tag}</div>
            <h2 className="section-title">{t.tecnici.titolo1}<br /><em style={{ fontStyle: "italic", color: "#5DCAA5" }}>{t.tecnici.titolo2}</em></h2>
            <p className="section-sub">{t.tecnici.sottotitolo}</p>

            <div className="tecnici-benefits">
              {["🎯", "💸", "⭐"].map((icon, i) => ({ icon, ...t.tecnici.vantaggi[i] })).map((b, i) => (
                <div className="tecnici-benefit" key={i}>
                  <div className="tecnici-benefit-icon">{b.icon}</div>
                  <div>
                    <h3>{b.titolo}</h3>
                    <p>{b.testo}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="tecnici-cta">
              <a href="/iscriviti-tecnico" className="btn-white">{t.tecnici.iscriviti} →</a>
              <a href="#" className="btn-ghost-white">{t.tecnici.scopri}</a>
            </div>
          </div>

          <div className="tecnici-stats">
            {t.tecnici.numeri.map((s, i) => (
              <div className="tecnici-stat" key={i}>
                <div className="tecnici-stat-num">{s.valore}</div>
                <div className="tecnici-stat-label">{s.etichetta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA FINALE */}
      <div className="cta-final">
        <div className="section-tag" style={{ textAlign: "center" }}>{t.finale.tag}</div>
        <h2 className="section-title">{t.finale.titolo1}<br /><em className="serif" style={{ color: "var(--verde)" }}>{t.finale.titolo2}</em></h2>
        <p className="section-sub" style={{ margin: "0 auto 40px" }}>{t.finale.sottotitolo}</p>
        <a href="/diagnosi" className="btn-primary" style={{ fontSize: "16px", padding: "18px 36px" }}>
          {t.finale.avvia} →
        </a>
        {/* La garanzia sta qui, sotto il pulsante, perché è qui che uno decide
            se fidarsi di un servizio che non conosce — ed è la fiducia
            l'ostacolo, non i €9,90. */}
        <p style={{ margin: "18px auto 0", fontSize: "14px", color: "var(--grigio)", maxWidth: "460px", lineHeight: 1.6 }}>
          <strong style={{ color: "var(--verde)" }}>{t.finale.garanziaTitolo}</strong>{" "}
          {t.finale.garanziaTesto}
        </p>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">Fixi</div>
        {/* fixi.casa era un dominio mai posseduto, rimasto qui da quando il
            sito viveva su .vercel.app. Dal 03/09/2026 l'indirizzo vero e'
            questo. */}
        <div>{t.footer.descrizione} · fixiai.it</div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {/* Le guide ai guasti: e' da qui che Google raggiunge le pagine
              nuove, quindi il link deve stare su OGNI schermata, non solo
              in una sezione che si visita di rado. */}
          {guide ? <a href="/guida" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>{t.footer.guide}</a> : null}
          <a href="/privacy" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>{t.footer.privacy}</a>
          {/* Anche qui e non solo dentro /diagnosi: l'app si apre su questa
              pagina, ed e' la prima che guarda chi deve segnalare un problema. */}
          <a href="/stato" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>{t.footer.stato}</a>
          <span>© 2026 Fixi</span>
        </div>
      </footer>
    </>
  );
}