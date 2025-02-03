import express from 'express';
const router = express.Router();

import service from '../services/theme.js';
import middleware from '../middlewares/private.js';

router.get('/', service.getAll);
router.get('/:id', middleware.checkJWT, service.getById);
router.post('/add', middleware.checkJWT, middleware.checkAdmin, service.add);
router.put('/:id', middleware.checkJWT, middleware.checkAdmin, service.update);
router.delete('/:id', middleware.checkJWT, middleware.checkAdmin, service.delete);
router.post('/add-cursus', middleware.checkAdmin, service.addCursusToTheme);

export default router;
