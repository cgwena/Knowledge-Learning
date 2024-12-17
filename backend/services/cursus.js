const Cursus = require("../models/cursus");
const Lesson = require("../models/lesson");

exports.add = async (req, res) => {
  const { title, price, lessons } = req.body;

  // Validation des entrées
  if (!title || !price) {
    return res.status(400).json({ error: "Les champs title et price sont requis." });
  }

  try {
    // Créer un nouveau cursus
    const newCursus = await Cursus.create({
      title,
      price,
      lessons, // Attache les leçons via leurs ObjectId
    });

    return res.status(201).json(newCursus);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtenir tous les cursus
exports.getAll = async (req, res) => {
  try {
    const cursusList = await Cursus.find().populate("lessons"); // Charge les leçons associées
    return res.status(200).json(cursusList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtenir un cursus par ID
exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const cursus = await Cursus.findById(id).populate("lessons"); // Charge les données des leçons
    if (!cursus) {
      return res.status(404).json({ error: "Cursus introuvable." });
    }
    return res.status(200).json(cursus);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, price, lessons } = req.body;

  try {
    const updatedCursus = await Cursus.findByIdAndUpdate(
      id,
      { title, price, lessons }, // Met à jour le titre, le prix et les leçons
      { new: true } // Retourne le document mis à jour
    ).populate("lessons"); // Recharge les leçons associées

    if (!updatedCursus) {
      return res.status(404).json({ error: "Cursus introuvable." });
    }

    return res.status(200).json(updatedCursus);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCursus = await Cursus.findByIdAndDelete(id);

    if (!deletedCursus) {
      return res.status(404).json({ error: 'Cursus introuvable.' });
    }

    return res.status(200).json({ message: 'Cursus supprimé avec succès.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
