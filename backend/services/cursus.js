const Cursus = require("../models/cursus");
const Theme = require("../models/theme");

exports.add = async (req, res) => {
  const { title, price, themeName } = req.body;

  // Validation des entrées
  if (!title || !themeName) {
    return res
      .status(400)
      .json({ error: "Les champs title et themeName sont requis." });
  }

  try {
    // Vérifier que le thème existe
    const theme = await Theme.findOne({ title: themeName });
    if (!theme) {
      return res.status(404).json({ error: "Thème introuvable." });
    }

    // Créer un nouveau cursus
    const newCursus = await Cursus.create({
      title,
      price,
      theme: theme._id,
    });

    return res.status(201).json(newCursus);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtenir tous les cursus
exports.getAll = async (req, res) => {
  try {
    const cursusList = await Cursus.find().populate("theme"); // Récupérer les thèmes associés
    return res.status(200).json(cursusList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtenir un cursus par ID
exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const cursus = await Cursus.findById(id).populate("theme"); // Récupérer le thème associé
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
  const { title, price } = req.body;

  try {
    const updatedCursus = await Cursus.findByIdAndUpdate(
      id,
      { title, price },
      { new: true } // Retourne le document mis à jour
    );

    if (!updatedCursus) {
      return res.status(404).json({ error: 'Cursus introuvable.' });
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
