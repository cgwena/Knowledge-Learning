import express from 'express';
const router = express.Router();

import createCheckoutSession from '../services/stripe.js'

router.post("/", async (req, res) => {
    try {
      const { orderId, products } = req.body;
      const sessionUrl = await createCheckoutSession(orderId, products);
      res.json({ url: sessionUrl });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

export default router
