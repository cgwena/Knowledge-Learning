var express = require('express');
var router = express.Router();

const service = require('../services/lesson')
const private = require('../middlewares/private')

// router.get('/:id', private.checkJWT, service.getById);
router.post('/add', service.add)
// router.patch('/update/:id', private.checkJWT, service.update)
// router.delete('/delete/:id', private.checkJWT, service.delete)
// router.post('/authenticate', service.authenticate)

module.exports = router;
