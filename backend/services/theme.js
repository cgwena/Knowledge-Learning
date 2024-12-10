const Theme = require('../models/theme')

exports.add = async (req, res, next) => {
    const temp = {
      title: req.body.title,
    };
  
    try {
      let theme = await Theme.create(temp);
      return res.status(201).json(theme);
    } catch (error) {
      return res.status(501).json(error);
    }
  };

// Obtenir toutes les leçons
exports.getAll = async (req, res) => {
  try {
    const themeList = await Theme.find()
    return res.status(200).json(themeList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtenir une leçon par ID
exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const theme = await Theme.findById(id)
    if (!theme) {
      return res.status(404).json({ error: "Leçon introuvable." });
    }
    return res.status(200).json(theme);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const updatedTheme = await Theme.findByIdAndUpdate(
      id,
      { title },
      { new: true } // Retourne le document mis à jour
    );

    if (!updatedTheme) {
      return res.status(404).json({ error: "Thème introuvable." });
    }

    return res.status(200).json(updatedTheme);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTheme = await Theme.findByIdAndDelete(id);

    if (!deletedTheme) {
      return res.status(404).json({ error: "Thème introuvable." });
    }

    return res.status(200).json({ message: "Thème supprimé avec succès." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
