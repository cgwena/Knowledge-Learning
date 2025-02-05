import express from 'express';
const router = express.Router();

import orderService from '../services/order.js';
import middleware from '../middlewares/private.js';

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API pour gérer les commandes
 */

/**
 * @swagger
 * /orders/:
 *   post:
 *     summary: Créer une nouvelle commande
 *     description: Crée une nouvelle commande pour l'utilisateur authentifié.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                 example: [{ "productId": "123", "quantity": 2 }]
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé - Token invalide ou manquant
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/', middleware.checkJWT, orderService.createOrder);

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     summary: Récupérer les commandes d'un utilisateur
 *     description: Retourne toutes les commandes passées par un utilisateur spécifique.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur dont on veut récupérer les commandes
 *     responses:
 *       200:
 *         description: Liste des commandes de l'utilisateur
 *       400:
 *         description: ID utilisateur invalide
 *       404:
 *         description: Aucune commande trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/user/:userId', orderService.getOrdersByUser);

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Récupérer une commande par ID
 *     description: Retourne une commande spécifique.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande à récupérer
 *     responses:
 *       200:
 *         description: Commande trouvée avec succès
 *       400:
 *         description: ID commande invalide
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/:orderId', orderService.getOrderById);

/**
 * @swagger
 * /orders/{orderId}:
 *   put:
 *     summary: Mettre à jour le statut d'une commande
 *     description: Met à jour le statut d'une commande existante.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "shipped"
 *     responses:
 *       200:
 *         description: Commande mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.put('/:orderId', orderService.updateOrderStatus);

export default router;
