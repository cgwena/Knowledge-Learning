const Lesson = require('../models/lesson');
const Cursus = require('../models/cursus');

exports.add = async (req, res) => {
    const { title, text, video_url, price, cursusName } = req.body;
  
    // Validation des entrées
    if (!title || !cursusName) {
      return res.status(400).json({ error: 'Les champs title et cursusName sont requis.' });
    }
  
    try {
      // Vérifier que le cursus existe
      const cursus = await Cursus.findOne({title: cursusName });
      if (!cursus) {
        return res.status(404).json({ error: 'Cursus introuvable.' });
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