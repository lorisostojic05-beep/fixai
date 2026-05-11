import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: "session_id mancante" });
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