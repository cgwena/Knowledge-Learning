import express from 'express';
const router = express.Router();

import service from '../services/theme.js';
import middleware from '../middlewares/private.js';
/**
 * @swagger
 * tags:
 *   name: Thèmes
 *   description: API pour gérer les thèmes et cursus
 */

/**
 * @swagger
 * /theme/:
 *   get:
 *     summary: Récupérer tous les thèmes
 *     description: Retourne la liste de tous les thèmes disponibles.
 *     tags:
 *       - Thèmes
 *     responses:
 *       200:
 *         description: Liste des thèmes retournée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', service.getAll);

/**
 * @swagger
 * /theme/{id}:
 *   get:
 *     summary: Récupérer un thème par ID
 *     description: Retourne un thème spécifique en fonction de son ID. Nécessite une authentification.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Thèmes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du thème à récupérer
 *     responses:
 *       200:
 *         description: Thème trouvé avec succès
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       404:
 *         description: Thème non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:id', middleware.checkJWT, service.getById);

/**
 * @swagger
 * /theme/add:
 *   post:
 *     summary: Ajouter un nouveau thème
 *     description: Crée un nouveau thème. Nécessite une authentification et des droits administrateurs.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Thèmes
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
 *         description: Thème créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       403:
 *         description: Accès interdit - Droits administrateurs requis
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/add', middleware.checkJWT, middleware.checkAdmin, service.add);

/**
 * @swagger
 * /theme/{id}:
 *   put:
 *     summary: Mettre à jour un thème
 *     description: Met à jour les informations d'un thème existant. Nécessite une authentification et des droits administrateurs.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Thèmes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du thème à mettre à jour
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
 *         description: Thème mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       403:
 *         description: Accès interdit - Droits administrateurs requis
 *       404:
 *         description: Thème non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:id', middleware.checkJWT, middleware.checkAdmin, service.update);

/**
 * @swagger
 * /theme/{id}:
 *   delete:
 *     summary: Supprimer un thème
 *     description: Supprime un thème existant. Nécessite une authentification et des droits administrateurs.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Thèmes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du thème à supprimer
 *     responses:
 *       200:
 *         description: Thème supprimé avec succès
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       403:
 *         description: Accès interdit - Droits administrateurs requis
 *       404:
 *         description: Thème non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/:id', middleware.checkJWT, middleware.checkAdmin, service.delete);

/**
 * @swagger
 * /theme/add-cursus:
 *   post:
 *     summary: Ajouter un cursus à un thème
 *     description: Ajoute un cursus à un thème existant. Nécessite des droits administrateurs.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Thèmes
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
 *         description: Cursus ajouté au thème avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       403:
 *         description: Accès interdit - Droits administrateurs requis
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/add-cursus', middleware.checkAdmin, service.addCursusToTheme);

export default router;
