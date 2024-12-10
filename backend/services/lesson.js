const Lesson = require("../models/lesson");
const Cursus = require("../models/cursus");

exports.add = async (req, res) => {
  const { title, text, video_url, price, cursusName } = req.body;

  // Validation des entrées
  if (!title || !cursusName) {
    return res
      .status(400)
      .json({ error: "Les champs title et cursusName sont requis." });
  }

  try {
    // Vérifier que le cursus existe
    const cursus = await Cursus.findOne({ title: cursusName });
    if (!cursus) {
      return res.status(404).json({ error: "Cursus introuvable." });
    }

    // Créer une nouvelle leçon
    const newLesson = await Lesson.create({
      title,
      text,
      video_url,
      price,
      cursus: cursus._id,
    });

    return res.status(201).json(newLesson);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtenir toutes les leçons
exports.getAll = async (req, res) => {
  try {
    const lessonList = await Lesson.find().populate("cursus"); // Récupérer les thèmes associés
    return res.status(200).json(lessonList);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Obtenir une leçon par ID
exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const lesson = await Lesson.findById(id).populate("cursus"); // Récupérer le thème associé
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
