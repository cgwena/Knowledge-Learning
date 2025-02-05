import express from 'express';
const router = express.Router();

import service from '../services/lesson.js';
import middleware from '../middlewares/private.js';
/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: API pour gérer les leçons protégées par authentification et rôle administrateur
 */

/**
 * @swagger
 * /lesson/:
 *   get:
 *     summary: Récupérer toutes les leçons
 *     description: Retourne la liste de toutes les leçons. Nécessite une authentification via JWT.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Lessons
 *     responses:
 *       200:
 *         description: Liste des leçons retournée avec succès
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', middleware.checkJWT, service.getAll);

/**
 * @swagger
 * /lesson/{id}:
 *   get:
 *     summary: Récupérer une leçon par ID
 *     description: Retourne une leçon spécifique. Nécessite une authentification via JWT.
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
 *         description: Leçon trouvée avec succès
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       404:
 *         description: Leçon non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:id', middleware.checkJWT, service.getById);

/**
 * @swagger
 * /lesson/add:
 *   post:
 *     summary: Ajouter une nouvelle leçon
 *     description: Crée une nouvelle leçon. Nécessite une authentification et des droits administrateurs.
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
 *         description: Leçon créée avec succès
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
 * /lesson/{id}:
 *   put:
 *     summary: Mettre à jour une leçon
 *     description: Met à jour une leçon existante. Nécessite une authentification et des droits administrateurs.
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
 *         description: ID de la leçon à mettre à jour
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
 *         description: Leçon mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       403:
 *         description: Accès interdit - Droits administrateurs requis
 *       404:
 *         description: Leçon non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:id', middleware.checkJWT, middleware.checkAdmin, service.update);

/**
 * @swagger
 * /lesson/{id}:
 *   delete:
 *     summary: Supprimer une leçon
 *     description: Supprime une leçon existante. Nécessite une authentification et des droits administrateurs.
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
 *         description: ID de la leçon à supprimer
 *     responses:
 *       200:
 *         description: Leçon supprimée avec succès
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       403:
 *         description: Accès interdit - Droits administrateurs requis
 *       404:
 *         description: Leçon non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/:id', middleware.checkJWT, middleware.checkAdmin, service.delete);

export default router;
