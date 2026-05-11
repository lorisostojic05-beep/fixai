import jsPDF from "jspdf";

export function generaRefertoPDF(report, appliance, brand, problem) {
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
  doc.text("FixAI", margin, 20);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Diagnosi elettrodomestici via videochiamata AI", margin, 28);
  doc.setFontSize(9);
  doc.setTextColor(180, 230, 210);
  const data = new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
  doc.text(`Referto del ${data}`, margin, 38);
  const refNum = `#${Date.now().toString().slice(-6)}`;
  doc.text(`Referto ${refNum}`, W - margin, 20, { align: "right" });

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
  doc.text(`Problema riportato: "${problem}"`, margin + 5, y + 16);

  y += 30;

  y = disegnaSezione(doc, { y, margin, contentW, titolo: "DIAGNOSI", testo: report.diagnosis, coloreBox: verdeChiaro, coloreBordo: verde, coloreTitolo: verde });

  if (report.diyPossible && report.diyInstructions) {
    y = disegnaSezione(doc, { y, margin, contentW, titolo: "SOLUZIONE FAI-DA-TE", testo: report.diyInstructions, coloreBox: verdeChiaro, coloreBordo: [29, 158, 117], coloreTitolo: [15, 110, 86], badge: "Risolvibile in autonomia", badgeColore: verde });
  }

  if (report.sparePart) {
    const testoRicambio = [`Nome: ${report.sparePart.name}`, report.sparePart.code ? `Codice: ${report.sparePart.code}` : null, `Prezzo stimato: ${report.sparePart.price}`].filter(Boolean).join("\n");
    y = disegnaSezione(doc, { y, margin, contentW, titolo: "PEZZO DA SOSTITUIRE", testo: testoRicambio, coloreBox: amberChiaro, coloreBordo: amber, coloreTitolo: amber });
  }

  y = disegnaSezione(doc, { y, margin, contentW, titolo: "STIMA INTERVENTO TECNICO", testo: `${report.technicianCost}\n\nMostra questo referto al tecnico per ottenere un prezzo equo.`, coloreBox: bluChiaro, coloreBordo: blu, coloreTitolo: blu });

  if (report.urgency) {
    const urgenzaColori = { bassa: [[200, 240, 220], [15, 110, 86]], media: [[250, 238, 218], [133, 79, 11]], alta: [[253, 220, 220], [160, 30, 30]] };
    const [bgCol, textCol] = urgenzaColori[report.urgency] || urgenzaColori.media;
    doc.setFillColor(...bgCol);
    doc.roundedRect(margin, y, contentW, 12, 2, 2, "F");
    doc.setTextColor(...textCol);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`Urgenza: ${report.urgency.toUpperCase()} — ${report.urgency === "bassa" ? "Nessuna fretta" : report.urgency === "media" ? "Intervieni entro qualche giorno" : "Intervieni il prima possibile"}`, margin + 5, y + 8);
    y += 18;
  }

  const pageH = 297;
  doc.setFillColor(...verde);
  doc.rect(0, pageH - 20, W, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("FixAI — Diagnosi elettrodomestici via AI", margin, pageH - 12);
  doc.text("fixai.app", W - margin, pageH - 12, { align: "right" });
  doc.setTextColor(180, 230, 210);
  doc.text("Questo referto è generato da un sistema AI a scopo diagnostico.", W / 2, pageH - 6, { align: "center" });

  doc.save(`FixAI_Referto_${refNum}.pdf`);
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