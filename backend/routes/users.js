var express = require('express');
var router = express.Router();

const service = require('../services/user')
const private = require('../middlewares/private')

/* GET users listing. */
router.get('/', private.checkJWT, service.getAll);
router.get('/:id', private.checkJWT, service.getById);
router.put('/add', service.add)
router.patch('/update/:id', private.checkJWT, service.update)
router.delete('/delete/:id', private.checkJWT, service.delete)
router.post('/authenticate', service.authenticate)

module.exports = router;
