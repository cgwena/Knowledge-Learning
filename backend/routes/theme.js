var express = require('express');
var router = express.Router();

const service = require('../services/theme')
const private = require('../middlewares/private')

router.get('/', service.getAll);
router.get('/:id', private.checkJWT, service.getById);
router.post('/add', service.add)
router.put('/:id', private.checkJWT, service.update)
router.delete('/:id', private.checkJWT, service.delete)
router.post('/add-cursus', service.addCursusToTheme);

module.exports = router;
