const Cursus = require('../models/cursus');
const Theme = require('../models/theme');

exports.add = async (req, res) => {
    const { title, price, themeName } = req.body;
  
    // Validation des entrées
    if (!title || !themeName) {
      return res.status(400).json({ error: 'Les champs title et themeName sont requis.' });
    }
  
    try {
      // Vérifier que le thème existe
      const theme = await Theme.findOne({ title: themeName });
      if (!theme) {
        return res.status(404).json({ error: 'Thème introuvable.' });
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