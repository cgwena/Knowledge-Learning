const express = require('express');
const router = express.Router();
const orderService = require('../services/order');

// Création d'une commande
router.post('/', orderService.createOrder);

// Récupération des commandes d'un utilisateur
router.get('/user/:userId', orderService.getOrdersByUser);

// Mise à jour de l'état d'une commande
router.put('/:orderId', orderService.updateOrderStatus);

module.exports = router;
