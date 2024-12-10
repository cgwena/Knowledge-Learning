const Order = require("../models/order");
const Lesson = require("../models/lesson");
const Cursus = require("../models/cursus");

exports.createOrder = async (req, res) => {
  const { userId, items } = req.body;

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
      user: userId,
      items: validatedItems,
      totalPrice,
    });

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
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

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Commande introuvable." });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
