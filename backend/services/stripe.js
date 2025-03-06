import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (orderId, products, stripeInstance = stripe) => {
  console.log("createCheckoutSession appelée");
  console.log("Produits reçus par le backend :", products);

  try {
    const lineItems = products.map((product) => {
      if (!product.title || !product.price) {
        throw new Error("Produit invalide : title et price sont requis");
      }

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.title,
          },
          unit_amount: product.price * 100,
        },
        quantity: 1,
      };
    });

    console.log("line_items envoyés à Stripe :", JSON.stringify(lineItems, null, 2));

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:8080/success?orderId=${orderId}`,
      cancel_url: `http://localhost:8080/cancel`,
    });

    return session.url;
  } catch (error) {
    console.error("Erreur Stripe:", error);
    throw new Error("Erreur lors de la création de la session Stripe.");
  }
};

export default createCheckoutSession;
