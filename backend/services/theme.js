import Theme from '../models/theme.js';
import Cursus from '../models/cursus.js';

// Ajouter un nouveau thème
const add = async (req, res) => {
  const { title, cursus } = req.body;
  if (!req.decoded) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }

  const created_by = req.decoded.id;

  try {
    const theme = await Theme.create({ title, cursus, created_by });
    return res.status(201).json(theme);
  } catch (error) {
    return res.status(501).json(error);
  }
};

// Obtenir tous les thèmes avec leurs cursus et leçons
const getAll = async (req, res) => {
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
const getById = async (req, res) => {
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

// Mettre à jour un thème et ajouter des cursus
const update = async (req, res) => {
  const { id } = req.params;
  const { title, cursus } = req.body;
  if (!req.decoded) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }

  const updated_by= req.decoded.id;

  try {
    const updateData = {updated_by};
    if (title) updateData.title = title;
    if (cursus && cursus.length > 0) {
      updateData.$addToSet = { cursus: { $each: cursus } };
    }

    const updatedTheme = await Theme.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
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
const deleteTheme = async (req, res) => {
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
const addCursusToTheme = async (req, res) => {
  const { themeId, cursusId } = req.body;

  try {
    const theme = await Theme.findById(themeId);
    if (!theme) {
      return res.status(404).json({ error: "Thème introuvable." });
    }

    const cursus = await Cursus.findById(cursusId);
    if (!cursus) {
      return res.status(404).json({ error: "Cursus introuvable." });
    }

    const updatedTheme = await Theme.findByIdAndUpdate(
      themeId,
      { $addToSet: { cursus: cursusId } },
      { new: true }
    ).populate('cursus');

    return res.status(200).json(updatedTheme);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  add,
  getAll,
  getById,
  update,
  delete: deleteTheme, // Avoid using 'delete' as a reserved word
  addCursusToTheme,
};
