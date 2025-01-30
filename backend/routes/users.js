var express = require('express');
var router = express.Router();

const service = require('../services/user')
const private = require('../middlewares/private')


router.get('/', private.checkJWT,  service.getAll);
router.get('/:id', private.checkJWT, service.getById);
router.post('/add', service.add)
router.patch('/update/:id', private.checkJWT, service.update)
router.delete('/delete/:id', private.checkJWT, service.delete)
router.post('/authenticate', service.authenticate)

router.patch('/lessons/:lessonId/complete', private.checkJWT, service.markLessonAsCompleted);

router.post("/register", service.registerUser);
router.get("/confirm/:token", service.confirmRegistration);

module.exports = router;
