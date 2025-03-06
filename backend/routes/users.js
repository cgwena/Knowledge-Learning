import express from 'express';
const router = express.Router();

import service from '../services/user.js';
import middleware from '../middlewares/private.js';

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: API pour gérer les utilisateurs et l'authentification
 */

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     description: Retourne la liste de tous les utilisateurs disponibles. Nécessite une authentification.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs retournée avec succès
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/', middleware.checkJWT, service.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     description: Retourne un utilisateur spécifique en fonction de son ID. Nécessite une authentification.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à récupérer
 *     responses:
 *       200:
 *         description: Utilisateur trouvé avec succès
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:id', middleware.checkJWT, service.getById);

/**
 * @swagger
 * /users/add:
 *   post:
 *     summary: Ajouter un nouvel utilisateur
 *     description: Crée un nouvel utilisateur sans authentification requise.
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/add', service.add);

/**
 * @swagger
 * /users/update/{id}:
 *   patch:
 *     summary: Mettre à jour un utilisateur
 *     description: Met à jour les informations d'un utilisateur existant. Nécessite une authentification.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane@example.com"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.patch('/update/:id', middleware.checkJWT, service.update);

/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     description: Supprime un utilisateur existant. Nécessite une authentification.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete('/delete/:id', middleware.checkJWT, middleware.checkAdmin, service.delete);

/**
 * @swagger
 * /users/authenticate:
 *   post:
 *     summary: Authentifier un utilisateur
 *     description: Vérifie les identifiants de l'utilisateur et retourne un token JWT en cas de succès.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Authentification réussie, token JWT retourné
 *       400:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/authenticate', service.authenticate);

/**
 * @swagger
 * /users/lessons/{lessonId}/complete:
 *   patch:
 *     summary: Marquer une leçon comme complétée
 *     description: Permet à un utilisateur authentifié de marquer une leçon comme terminée.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Lessons
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la leçon à marquer comme complétée
 *     responses:
 *       200:
 *         description: Leçon marquée comme complétée avec succès
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       404:
 *         description: Leçon non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.patch('/lessons/:lessonId/complete', middleware.checkJWT, service.markLessonAsCompleted);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Inscrire un nouvel utilisateur
 *     description: Permet à un utilisateur de s'inscrire en fournissant son email et son mot de passe.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *     responses:
 *       201:
 *         description: Inscription réussie, email de confirmation envoyé
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/register', service.registerUser);

/**
 * @swagger
 * /users/confirm/{token}:
 *   get:
 *     summary: Confirmer l'inscription d'un utilisateur
 *     description: Vérifie le token d'inscription et active le compte utilisateur.
 *     tags:
 *       - Authentification
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de confirmation d'inscription
 *     responses:
 *       200:
 *         description: Inscription confirmée avec succès
 *       400:
 *         description: Token invalide ou expiré
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/confirm/:token', service.confirmRegistration);

export default router;
