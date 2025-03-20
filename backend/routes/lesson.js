import express from 'express';
const router = express.Router();

import service from '../services/lesson.js';
import middleware from '../middlewares/private.js';

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: API to manage lessons. 
 *  */

/**
 * @swagger
 * /lesson/:
 *   get:
 *     summary: Get all lessons
 *     description: Return all lessons. Requires authentication via JWT.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Lessons
 *     responses:
 *       200:
 *         description: Lessons list found successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server internal error
 */
router.get('/', middleware.checkJWT, service.getAll);

/**
 * @swagger
 * /lesson/{id}:
 *   get:
 *     summary: Get a specific lesson by ID
 *     description: return a specific lesson by ID. Requires authentication via JWT.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la leçon à récupérer
 *     responses:
 *       200:
 *         description: Lesson found successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server internal error
 */
router.get('/:id', middleware.checkJWT, service.getById);

/**
 * @swagger
 * /lesson/add:
 *   post:
 *     summary: Add a new lesson
 *     description: Create a new lesson. Requires authentication via JWT and admin rights.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Lessons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Nouvelle leçon"
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Unauthorized - Admin rights required
 *       500:
 *         description: Server internal error
 */
router.post('/add', middleware.checkJWT, middleware.checkAdmin, service.add);

/**
 * @swagger
 * /lesson/{id}:
 *   put:
 *     summary: Update a lesson
 *     description: Update an existing lesson. Requires authentication via JWT and admin rights.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Leçon mise à jour"
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Unauthorized - Admin rights required
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server internal error
 */
router.put('/:id', middleware.checkJWT, middleware.checkAdmin, service.update);

/**
 * @swagger
 * /lesson/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     description: Delete an existing lesson. Requires authentication via JWT and admin rights.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID to delete
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Unauthorized - Admin rights required
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server internal error
 */
router.delete('/:id', middleware.checkJWT, middleware.checkAdmin, service.delete);

export default router;
