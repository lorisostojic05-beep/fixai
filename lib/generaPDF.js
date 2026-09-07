import jsPDF from "jspdf";
// L'estensione .js serve: Next.js la sottintende, Node in modalita' ESM no.
// Senza, questo modulo non si puo' provare da riga di comando — ed e' proprio
// cosi' che si controlla che il referto esca nella lingua giusta, senza dover
// pagare una diagnosi per vederlo. Stessa storia di lib/versione-app.js.
import { riempi } from "./frasi.js";

// Costruisce il referto e lo restituisce, senza decidere che farne: salvarlo
// o condividerlo cambia a seconda che si sia nel browser o dentro l'app.
//
// Le parole arrivano da fuori (testi.email e testi.pdf della lingua in corso):
// questo foglio e' quello che il cliente mette in mano al tecnico, e stamparlo
// in italiano a uno spagnolo lo rende inutile proprio nel momento che conta.
export function refertoPDF(report, appliance, brand, problem, testi, lingua) {
  const { doc, nomeFile } = costruisciReferto(report, appliance, brand, problem, testi, lingua);
  return { blob: doc.output("blob"), nomeFile };
}

function costruisciReferto(report, appliance, brand, problem, testi, lingua) {
  const e = testi.email;
  const p = testi.pdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const verde = [15, 110, 86];
  const verdeChiaro = [225, 245, 238];
  const grigio = [100, 100, 100];
  const grigioChiaro = [245, 245, 243];
  const nero = [26, 26, 24];
  const amber = [133, 79, 11];
  const amberChiaro = [250, 238, 218];
  const blu = [24, 95, 165];
  const bluChiaro = [230, 241, 251];

  const W = 210;
  const margin = 20;
  const contentW = W - margin * 2;
  let y = 0;

  doc.setFillColor(...verde);
  doc.rect(0, 0, W, 45, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("Fixi", margin, 20);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(e.sottotitolo, margin, 28);
  doc.setFontSize(9);
  doc.setTextColor(180, 230, 210);
  const data = new Date().toLocaleDateString(lingua || "it", { day: "numeric", month: "long", year: "numeric" });
  doc.text(riempi(p.dataReferto, { data }), margin, 38);
  // Il numero sta col cancelletto sul foglio, ma NON nel nome del file:
  // finisce in un percorso Android, dove il "#" crea problemi.
  const numero = Date.now().toString().slice(-6);
  doc.text(riempi(p.numeroReferto, { numero }), W - margin, 20, { align: "right" });

  y = 55;

  doc.setFillColor(...grigioChiaro);
  doc.roundedRect(margin, y, contentW, 22, 3, 3, "F");
  doc.setTextColor(...nero);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`${brand ? brand.toUpperCase() + " — " : ""}${appliance}`, margin + 5, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...grigio);
  doc.text(riempi(e.problema, { problema: problem }), margin + 5, y + 16);

  y += 30;

  y = disegnaSezione(doc, { y, margin, contentW, titolo: e.diagnosi, testo: report.diagnosis, coloreBox: verdeChiaro, coloreBordo: verde, coloreTitolo: verde });

  if (report.diyPossible && report.diyInstructions) {
    y = disegnaSezione(doc, { y, margin, contentW, titolo: e.faiDaTe, testo: report.diyInstructions, coloreBox: verdeChiaro, coloreBordo: [29, 158, 117], coloreTitolo: [15, 110, 86], badge: p.risolvibileDaSolo, badgeColore: verde });
  }

  if (report.sparePart) {
    const testoRicambio = [
      riempi(p.nome, { nome: report.sparePart.name }),
      report.sparePart.code ? riempi(p.codice, { codice: report.sparePart.code }) : null,
      riempi(p.prezzoStimato, { prezzo: report.sparePart.price }),
    ]
      .filter(Boolean)
      .join("\n");
    y = disegnaSezione(doc, { y, margin, contentW, titolo: e.pezzo, testo: testoRicambio, coloreBox: amberChiaro, coloreBordo: amber, coloreTitolo: amber });
  }

  y = disegnaSezione(doc, {
    y,
    margin,
    contentW,
    titolo: e.stima,
    testo: `${report.technicianCost}\n\n${p.mostraAlTecnico}`,
    coloreBox: bluChiaro,
    coloreBordo: blu,
    coloreTitolo: blu,
  });

  if (report.urgency) {
    const urgenzaColori = { bassa: [[200, 240, 220], [15, 110, 86]], media: [[250, 238, 218], [133, 79, 11]], alta: [[253, 220, 220], [160, 30, 30]] };
    const [bgCol, textCol] = urgenzaColori[report.urgency] || urgenzaColori.media;
    doc.setFillColor(...bgCol);
    doc.roundedRect(margin, y, contentW, 12, 2, 2, "F");
    doc.setTextColor(...textCol);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    // "bassa/media/alta" restano etichette italiane anche in un referto
    // spagnolo: non sono testo, sono la chiave che sceglie colore e frase.
    const nomeUrgenza = { bassa: e.urgenzaBassa, media: e.urgenzaMedia, alta: e.urgenzaAlta };
    const cosaFare = { bassa: e.urgenzaBassaCosaFare, media: e.urgenzaMediaCosaFare, alta: e.urgenzaAltaCosaFare };
    doc.text(
      riempi(e.urgenza, {
        livello: nomeUrgenza[report.urgency] || report.urgency,
        cosaFare: cosaFare[report.urgency] || "",
      }),
      margin + 5,
      y + 8
    );
    y += 18;
  }

  const pageH = 297;
  doc.setFillColor(...verde);
  doc.rect(0, pageH - 20, W, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(p.piedeSinistra, margin, pageH - 12);
  doc.text("Fixi.app", W - margin, pageH - 12, { align: "right" });
  doc.setTextColor(180, 230, 210);
  doc.text(p.piedeCentro, W / 2, pageH - 6, { align: "center" });

  return { doc, nomeFile: `Fixi_Referto_${numero}.pdf` };
}

function disegnaSezione(doc, { y, margin, contentW, titolo, testo, coloreBox, coloreBordo, coloreTitolo, badge, badgeColore }) {
  const padding = 5;
  const fontSize = 9;
  const lineH = 5;
  doc.setFontSize(fontSize);
  const righe = doc.splitTextToSize(testo, contentW - padding * 2 - 2);
  const altezzaTesto = righe.length * lineH;
  const altezzaBox = altezzaTesto + padding * 2 + 10;

  if (y + altezzaBox > 270) { doc.addPage(); y = 20; }

  doc.setFillColor(...coloreBox);
  doc.setDrawColor(...coloreBordo);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentW, altezzaBox, 3, 3, "FD");
  doc.setFillColor(...coloreBordo);
  doc.rect(margin, y, 3, altezzaBox, "F");
  doc.setTextColor(...coloreTitolo);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(titolo, margin + padding + 2, y + padding + 3);

  if (badge && badgeColore) {
    doc.setFillColor(...badgeColore);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    const badgeW = doc.getTextWidth(badge) + 6;
    doc.roundedRect(margin + contentW - badgeW - 3, y + 2, badgeW, 7, 2, 2, "F");
    doc.text(badge, margin + contentW - badgeW, y + 7);
  }

  doc.setTextColor(50, 50, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);
  doc.text(righe, margin + padding + 2, y + padding + 9);

  return y + altezzaBox + 6;
}