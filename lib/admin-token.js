// lib/admin-token.js
// Token firmato per le API admin: rilasciato da /api/admin-auth,
// verificato da tutti gli endpoint riservati.

import crypto from "crypto";

const DURATA_TOKEN_MS = 12 * 60 * 60 * 1000; // 12 ore

function chiaveSegreta() {
  // Derivata dalla password admin: cambiando ADMIN_PASSWORD si invalidano i token
  return crypto
    .createHash("sha256")
    .update(`fixi-admin-token:${process.env.ADMIN_PASSWORD || ""}`)
    .digest();
}

function firma(scadenza) {
  return crypto.createHmac("sha256", chiaveSegreta()).update(String(scadenza)).digest("hex");
}

export function creaTokenAdmin() {
  const scadenza = Date.now() + DURATA_TOKEN_MS;
  return `${scadenza}.${firma(scadenza)}`;
}

export function verificaTokenAdmin(req) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const [scadenzaStr, sig] = token.split(".");
  const scadenza = Number(scadenzaStr);
  if (!scadenza || !sig || Date.now() > scadenza) return false;

  const attesa = Buffer.from(firma(scadenza));
  const ricevuta = Buffer.from(sig);
  return ricevuta.length === attesa.length && crypto.timingSafeEqual(ricevuta, attesa);
}
