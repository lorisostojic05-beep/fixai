import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { voto, risolto, appliance, brand, problem } = req.body;

  const entry = {
    data: new Date().toISOString(),
    voto,
    risolto,
    appliance,
    brand,
    problem,
  };

  console.log("FEEDBACK:", JSON.stringify(entry));

  return res.status(200).json({ ok: true });
}