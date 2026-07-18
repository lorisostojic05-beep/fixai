// lib/supabase-admin.js
// Client Supabase per uso ESCLUSIVAMENTE server-side (API routes).
// Usa la service role key, che bypassa le RLS — mai importarlo nel frontend.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceKey) {
  console.warn(
    "⚠️ SUPABASE_SERVICE_ROLE_KEY mancante in .env.local — sto usando la chiave anon come ripiego. " +
      "Aggiungi la service role key (Supabase → Settings → API) e abilita le RLS sulle tabelle."
  );
}

export const supabaseAdmin = createClient(
  url,
  serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);
