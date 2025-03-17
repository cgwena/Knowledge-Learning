import Order from "../models/order.js";
import Lesson from "../models/lesson.js";
import Cursus from "../models/cursus.js";
import mongoose from 'mongoose';

const createOrder = async (req, res) => {
  const { items } = req.body;

  if (!req.decoded) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }

  const created_by = req.decoded.id;

  try {
    // Validation des items
    let totalPrice = 0;
    const validatedItems = await Promise.all(
      items.map(async (item) => {
        if (item.type === "lesson") {
          const lesson = await Lesson.findById(item.itemId);
          if (!lesson)
            throw new Error(`Leçon introuvable avec l'ID: ${item.itemId}`);
          totalPrice += lesson.price;
          return { ...item, price: lesson.price };
        } else if (item.type === "cursus") {
          const cursus = await Cursus.findById(item.itemId);
          if (!cursus)
            throw new Error(`Cursus introuvable avec l'ID: ${item.itemId}`);
          totalPrice += cursus.price;
          return { ...item, price: cursus.price };
        } else {
          throw new Error("Type d’élément invalide.");
        }
      })
    );

    // Création de la commande
    const order = await Order.create({
      user: req.decoded.id,
      items: validatedItems,
      totalPrice,
      created_by,
    });

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getOrdersByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ user: userId }).populate(
      "items.itemId",
      "title price"
    );
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  // Vérifiez si orderId est un ObjectId valide
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ error: "Invalid Order ID" });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!req.decoded) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }

  const updated_by= req.decoded.id;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updated_by },
    );

    if (!order) {
      return res.status(404).json({ error: "Commande introuvable." });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default { createOrder, getOrdersByUser, getOrderById, updateOrderStatus };
