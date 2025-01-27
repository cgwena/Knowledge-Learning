var express = require('express');
var router = express.Router();

const service = require('../services/cursus')
const private = require('../middlewares/private')

router.get('/', private.checkJWT, service.getAll)
router.get('/:id', private.checkJWT, service.getById);
router.post('/add', private.checkJWT, private.checkAdmin, service.add)
router.put('/:id', private.checkJWT, private.checkAdmin, service.update)
router.delete('/:id', private.checkJWT, private.checkAdmin, service.delete)

module.exports = router;
