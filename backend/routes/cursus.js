import express from "express";
const router = express.Router();

import service from "../services/cursus.js";
import middleware from "../middlewares/private.js";

/**
 * @swagger
 * tags:
 *   name: Cursus
 *   description: API pour gérer les cursus
 */

/**
 * @swagger
 * /cursus/:
 *   get:
 *     summary: Récupérer tous les cursus
 *     description: Retourne la liste de tous les cursus disponibles.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Cursus
 *     responses:
 *       200:
 *         description: Liste des cursus retournée avec succès
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/", middleware.checkJWT, service.getAll);

/**
 * @swagger
 * /cursus/{id}:
 *   get:
 *     summary: Récupérer un cursus par ID
 *     description: Retourne un cursus spécifique en fonction de son ID.
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
 *         description: ID du cursus à récupérer
 *     responses:
 *       200:
 *         description: Cursus trouvé avec succès
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       404:
 *         description: Cursus non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/:id", middleware.checkJWT, service.getById);

/**
 * @swagger
 * /cursus/add:
 *   post:
 *     summary: Ajouter un nouveau cursus
 *     description: Crée un nouveau cursus. Nécessite des permissions administratives.
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
 *                 example: "Cursus Informatique"
 *               description:
 *                 type: string
 *                 example: "Formation avancée en informatique"
 *     responses:
 *       201:
 *         description: Cursus créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       403:
 *         description: Accès interdit - Permission administrateur requise
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/add", middleware.checkJWT, middleware.checkAdmin, service.add);

/**
 * @swagger
 * /cursus/{id}:
 *   put:
 *     summary: Mettre à jour un cursus
 *     description: Met à jour les informations d'un cursus existant. Nécessite des permissions administratives.
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
 *         description: ID du cursus à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Cursus Mise à jour"
 *               description:
 *                 type: string
 *                 example: "Nouvelle description du cursus"
 *     responses:
 *       200:
 *         description: Cursus mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       403:
 *         description: Accès interdit - Permission administrateur requise
 *       404:
 *         description: Cursus non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/:id", middleware.checkJWT, middleware.checkAdmin, service.update);

/**
 * @swagger
 * /cursus/{id}:
 *   delete:
 *     summary: Supprimer un cursus
 *     description: Supprime un cursus existant. Nécessite des permissions administratives.
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
 *         description: ID du cursus à supprimer
 *     responses:
 *       200:
 *         description: Cursus supprimé avec succès
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       403:
 *         description: Accès interdit - Permission administrateur requise
 *       404:
 *         description: Cursus non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete("/:id", middleware.checkJWT, middleware.checkAdmin, service.delete);

export default router;
