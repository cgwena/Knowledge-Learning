import Lesson from "../models/lesson.js";

// Add a lesson
const add = async (req, res) => {
  const { title, text, video_url, price } = req.body;

  if (!req.decoded) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }

  const created_by = req.decoded.id;

  // Entry validation
  if (!title) {
    return res
      .status(400)
      .json({ error: "Le champ title est requis." });
  }

  try {
    // Create a new lesson
    const newLesson = await Lesson.create({
      title,
      text,
      video_url,
      price,
      created_by,
    });

    return res.status(201).json(newLesson);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all lessons
const getAll = async (req, res) => {
  try {
    const lessonList = await Lesson.find();
    return res.status(200).json(lessonList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get a lesson by id
const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const lesson = await Lesson.findById(id); // Récupérer la leçon
    if (!lesson) {
      return res.status(404).json({ error: "Leçon introuvable." });
    }
    return res.status(200).json(lesson);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a lesson
const update = async (req, res) => {
  const { id } = req.params;
  const { title, price, text, video_url } = req.body;
  if (!req.decoded) {
    return res.status(401).json({ error: "Utilisateur non authentifié." });
  }

  const updated_by= req.decoded.id;

  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      { title, price, text, video_url, updated_by },
      { new: true } // Retourne le document mis à jour
    );

    if (!updatedLesson) {
      return res.status(404).json({ error: "Leçon introuvable." });
    }

    return res.status(200).json(updatedLesson);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a lesson
const deleteLesson = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLesson = await Lesson.findByIdAndDelete(id);

    if (!deletedLesson) {
      return res.status(404).json({ error: "Leçon introuvable." });
    }

    return res.status(200).json({ message: "Leçon supprimée avec succès." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default { add, getAll, getById, update, delete: deleteLesson };
