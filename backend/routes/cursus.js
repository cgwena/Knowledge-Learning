import express from "express";
const router = express.Router();

import service from "../services/cursus.js";
import middleware from "../middlewares/private.js";

/**
 * @swagger
 * tags:
 *   name: Cursus
 *   description: API to manage cursus.
 */

/**
 * @swagger
 * /cursus/:
 *   get:
 *     summary: get all cursus
 *     description: return all cursus
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Cursus
 *     responses:
 *       200:
 *         description: Cursus list found successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: server internal error
 */
router.get("/", middleware.checkJWT, service.getAll);

/**
 * @swagger
 * /cursus/{id}:
 *   get:
 *     summary: Get a specific cursus by ID
 *     description: return a specific cursus by ID
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Cursus
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cursus ID
 *     responses:
 *       200:
 *         description: Cursus found successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Cursus not found
 *       500:
 *         description: Server internal error
 */
router.get("/:id", middleware.checkJWT, service.getById);

/**
 * @swagger
 * /cursus/add:
 *   post:
 *     summary: Add a new cursus
 *     description: Create a new cursus. Requires admin permissions.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Cursus
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Informatique"
 *               description:
 *                 type: string
 *                 example: "Formation avancée en informatique"
 *     responses:
 *       201:
 *         description: Cursus created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Unauthorized - Admin permission required
 *       500:
 *         description: Server internal error
 */
router.post("/add", middleware.checkJWT, middleware.checkAdmin, service.add);

/**
 * @swagger
 * /cursus/{id}:
 *   put:
 *     summary: Update a cursus
 *     description: Update an existing cursus. Requires admin permissions.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Cursus
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cursus ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Cursus Mis à jour"
 *               description:
 *                 type: string
 *                 example: "Nouvelle description du cursus"
 *     responses:
 *       200:
 *         description: Cursus updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Unauthorized - Admin permission required
 *       404:
 *         description: Cursus not found
 *       500:
 *         description: Server internal error
 */
router.put("/:id", middleware.checkJWT, middleware.checkAdmin, service.update);

/**
 * @swagger
 * /cursus/{id}:
 *   delete:
 *     summary: Delete a cursus
 *     description: Delete a specific cursus by ID. Requires admin permissions.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Cursus
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Cursus ID
 *     responses:
 *       200:
 *         description: Cursus deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Unauthorized - Admin permission required
 *       404:
 *         description: Cursus not found
 *       500:
 *         description: Server internal error
 */
router.delete("/:id", middleware.checkJWT, middleware.checkAdmin, service.delete);

export default router;
