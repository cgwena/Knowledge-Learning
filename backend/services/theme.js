const Theme = require('../models/theme');
const Cursus = require('../models/cursus');

// Ajouter un nouveau thème
exports.add = async (req, res, next) => {
  const { title, cursus } = req.body;

  try {
    let theme = await Theme.create({
      title,
      cursus, 
    });
    return res.status(201).json(theme);
  } catch (error) {
    return res.status(501).json(error);
  }
};

// Obtenir tous les thèmes avec leurs cursus et leçons
exports.getAll = async (req, res) => {
  try {
    const themeList = await Theme.find()
      .populate({
        path: 'cursus', // Associe les cursus liés au thème
        populate: {
          path: 'lessons', // Associe les leçons liées aux cursus
        },
      });

    return res.status(200).json(themeList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtenir un thème par ID avec ses cursus et leçons
exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const theme = await Theme.findById(id)
      .populate({
        path: 'cursus',
        populate: {
          path: 'lessons',
        },
      });

    if (!theme) {
      return res.status(404).json({ error: "Thème introuvable." });
    }
    return res.status(200).json(theme);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un thème
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

// Supprimer un thème
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

// Ajouter un cursus à un thème
exports.addCursusToTheme = async (req, res) => {
  const { themeId, cursusId } = req.body;

  try {
    // Vérifier si le thème existe
    const theme = await Theme.findById(themeId);
    if (!theme) {
      return res.status(404).json({ error: "Thème introuvable." });
    }

    // Vérifier si le cursus existe
    const cursus = await Cursus.findById(cursusId);
    if (!cursus) {
      return res.status(404).json({ error: "Cursus introuvable." });
    }

    // Ajouter le cursus au tableau `cursus` du thème
    const updatedTheme = await Theme.findByIdAndUpdate(
      themeId,
      { $addToSet: { cursus: cursusId } }, // Utilise $addToSet pour éviter les doublons
      { new: true } // Retourne le document mis à jour
    ).populate('cursus');

    return res.status(200).json(updatedTheme);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
