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