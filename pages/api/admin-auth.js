// pages/api/admin-auth.js
import crypto from "crypto";
import { creaTokenAdmin } from "../../lib/admin-token";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { password } = req.body || {};
  const attesa = process.env.ADMIN_PASSWORD || "";

  // Confronto constant-time su hash per non rivelare la lunghezza della password
  const hashRicevuta = crypto.createHash("sha256").update(String(password || "")).digest();
  const hashAttesa = crypto.createHash("sha256").update(attesa).digest();
  const ok = attesa.length > 0 && crypto.timingSafeEqual(hashRicevuta, hashAttesa);

  if (ok) {
    return res.status(200).json({ ok: true, token: creaTokenAdmin() });
  }
  return res.status(401).json({ ok: false });
}
