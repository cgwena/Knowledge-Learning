var express = require('express');
var router = express.Router();

const service = require('../services/lesson')
const private = require('../middlewares/private')

router.get('/', private.checkJWT, service.getAll);
router.get('/:id', private.checkJWT, service.getById);
router.post('/add', private.checkJWT, private.checkAdmin, service.add)
router.put('/:id', private.checkJWT, service.update)
router.delete('/:id', private.checkJWT, private.checkAdmin, service.delete)


module.exports = router;
