import Cursus from "../models/cursus.js";
import Lesson from "../models/lesson.js";

// Add a cursus
const add = async (req, res) => {
  const { title, price, lessons} = req.body;

  if (!req.decoded) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }

  const created_by = req.decoded.id;

  // Entry validation
  if (!title || !price) {
    return res.status(400).json({ error: "Les champs title et price sont requis." });
  }

  try {
    // Create a new cursus
    const newCursus = await Cursus.create({
      title,
      price,
      lessons, 
      created_by,
    });

    return res.status(201).json(newCursus);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all cursus
const getAll = async (req, res) => {
  try {
    const cursusList = await Cursus.find().populate("lessons"); // Charge les leçons associées
    return res.status(200).json(cursusList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a cursus by id
const getById = async (req, res) => {
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

// Update a cursus
const update = async (req, res) => {
  const { id } = req.params;
  const { title, price, lessons } = req.body;

  if (!req.decoded) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }

  const updated_by= req.decoded.id;

  try {
    const updatedCursus = await Cursus.findByIdAndUpdate(
      id,
      { title, price, lessons, updated_by }, 
      { new: true } //
    ).populate("lessons"); 

    if (!updatedCursus) {
      return res.status(404).json({ error: "Cursus introuvable." });
    }

    return res.status(200).json(updatedCursus);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a cursus
const deleteCursus = async (req, res) => {
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

export default { add, getAll, getById, update, delete: deleteCursus };
