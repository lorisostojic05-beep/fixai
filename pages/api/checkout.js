import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { appliance, brand, problem } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Diagnosi FixAI",
              description: "Sessione di videodiagnosi con AI — referto incluso",
            },
            unit_amount: 990,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/diagnosi?pagamento=ok&session_id={CHECKOUT_SESSION_ID}&appliance=${encodeURIComponent(appliance || "")}&brand=${encodeURIComponent(brand || "")}&problem=${encodeURIComponent(problem || "")}`,
      cancel_url: `${req.headers.origin}/diagnosi?pagamento=annullato`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Errore Stripe:", err);
    res.status(500).json({ error: err.message });
  }
}