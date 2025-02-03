import express from 'express';
const router = express.Router();

import service from '../services/user.js';
import middleware from '../middlewares/private.js';



router.get('/', middleware.checkJWT,  service.getAll);
router.get('/:id', middleware.checkJWT, service.getById);
router.post('/add', service.add)
router.patch('/update/:id', middleware.checkJWT, service.update)
router.delete('/delete/:id', middleware.checkJWT, service.delete)
router.post('/authenticate', service.authenticate)

router.patch('/lessons/:lessonId/complete', middleware.checkJWT, service.markLessonAsCompleted);

router.post("/register", service.registerUser);
router.get("/confirm/:token", service.confirmRegistration);

export default router;
