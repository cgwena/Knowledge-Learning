import express from 'express';
const router = express.Router();

import service from '../services/cursus.js';
import middleware from '../middlewares/private.js';

router.get('/', middleware.checkJWT, service.getAll);
router.get('/:id', middleware.checkJWT, service.getById);
router.post('/add', middleware.checkJWT, middleware.checkAdmin, service.add);
router.put('/:id', middleware.checkJWT, middleware.checkAdmin, service.update);
router.delete('/:id', middleware.checkJWT, middleware.checkAdmin, service.delete);

export default router;
