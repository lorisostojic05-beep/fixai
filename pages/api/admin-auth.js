// pages/api/admin-auth.js
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ ok: true });
  } else {
    return res.status(401).json({ ok: false });
  }
}