const Lesson = require("../models/lesson");

exports.add = async (req, res) => {
  const { title, text, video_url, price } = req.body;

  // Validation des entrées
  if (!title) {
    return res
      .status(400)
      .json({ error: "Le champs title est requis." });
  }

  try {
    // Créer une nouvelle leçon
    const newLesson = await Lesson.create({
      title,
      text,
      video_url,
      price,
    });

    return res.status(201).json(newLesson);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtenir toutes les leçons
exports.getAll = async (req, res) => {
  try {
    const lessonList = await Lesson.find();
    return res.status(200).json(lessonList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtenir une leçon par ID
exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const lesson = await Lesson.findById(id); // Récupérer le thème associé
    if (!lesson) {
      return res.status(404).json({ error: "Leçon introuvable." });
    }
    return res.status(200).json(lesson);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { title, price, text, video_url } = req.body;

  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      { title, price, text, video_url },
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

exports.delete = async (req, res) => {
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
