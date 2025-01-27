var express = require('express');
var router = express.Router();

const service = require('../services/theme')
const private = require('../middlewares/private')

router.get('/', service.getAll);
router.get('/:id', private.checkJWT, service.getById);
router.post('/add', private.checkJWT, private.checkAdmin, service.add)
router.put('/:id', private.checkJWT, private.checkAdmin, service.update)
router.delete('/:id', private.checkJWT, private.checkAdmin, service.delete)
router.post('/add-cursus', private.checkAdmin, service.addCursusToTheme);

module.exports = router;
