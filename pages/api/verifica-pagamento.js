import Stripe from "stripe";
import { supabaseAdmin } from "../../lib/supabase-admin";
import { ePagamentoApple } from "../../lib/pagamento-apple";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: "session_id mancante" });
  }

  // Un acquisto App Store e' gia' stato verificato con Apple da
  // /api/acquisto-apple, che l'ha registrato. Qui basta che la riga ci sia:
  // Stripe non lo conosce e non va chiamato.
  if (ePagamentoApple(session_id)) {
    const { data } = await supabaseAdmin
      .from("pagamenti")
      .select("stripe_session_id")
      .eq("stripe_session_id", session_id)
      .maybeSingle();
    return res.status(200).json({ pagato: !!data });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      return res.status(200).json({ pagato: true, email: session.customer_details?.email });
    } else {
      return res.status(200).json({ pagato: false });
    }
  } catch (err) {
    console.error("Errore verifica pagamento:", err);
    res.status(500).json({ error: err.message });
  }
}