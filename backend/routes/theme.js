import express from 'express';
const router = express.Router();

import service from '../services/theme.js';
import middleware from '../middlewares/private.js';

/**
 * @swagger
 * tags:
 *   name: Themes
 *   description: API to manage themes.
 */

/**
 * @swagger
 * /theme/:
 *   get:
 *     summary: Get all themes
 *     description: Return all themes. Requires authentication via JWT.
 *     tags:
 *       - Themes
 *     responses:
 *       200:
 *         description: Themes list found successfully
 *       500:
 *         description: Server internal error
 */
router.get('/', service.getAll);

/**
 * @swagger
 * /theme/{id}:
 *   get:
 *     summary: Get a specific theme by ID
 *     description: Return a specific theme by ID. Requires authentication via JWT.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Themes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Theme ID to retrieve
 *     responses:
 *       200:
 *         description: Theme found successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Theme not found
 *       500:
 *         description: Server internal error
 */
router.get('/:id', middleware.checkJWT, service.getById);

/**
 * @swagger
 * /theme/add:
 *   post:
 *     summary: Add a new theme
 *     description: Create a new theme. Requires authentication via JWT and admin rights.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Themes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Développement Web"
 *     responses:
 *       201:
 *         description: Theme created successfully
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
 * /theme/{id}:
 *   put:
 *     summary: Update a theme
 *     description: Update an existing theme. Requires authentication via JWT and admin rights.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Themes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Theme ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Développement Mobile"
 *     responses:
 *       200:
 *         description: Theme updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Unauthorized - Admin rights required
 *       404:
 *         description: Theme not found
 *       500:
 *         description: Server internal error
 */
router.put('/:id', middleware.checkJWT, middleware.checkAdmin, service.update);

/**
 * @swagger
 * /theme/{id}:
 *   delete:
 *     summary: Delete a theme
 *     description: Delete an existing theme. Requires authentication via JWT and admin rights.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Themes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Theme ID to delete
 *     responses:
 *       200:
 *         description: Theme deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Unauthorized - Admin rights required
 *       404:
 *         description: Theme not found
 *       500:
 *         description: Server internal error
 */
router.delete('/:id', middleware.checkJWT, middleware.checkAdmin, service.delete);

/**
 * @swagger
 * /theme/add-cursus:
 *   post:
 *     summary: Add a cursus to a theme
 *     description: Add a cursus to a theme. Requires authentication via JWT and admin rights.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Themes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               themeId:
 *                 type: string
 *                 example: "123456"
 *               cursusId:
 *                 type: string
 *                 example: "654321"
 *     responses:
 *       200:
 *         description: Cursus added to theme successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Unauthorized - Admin rights required
 *       500:
 *         description: Server internal error
 */
router.post('/add-cursus', middleware.checkAdmin, service.addCursusToTheme);

export default router;
