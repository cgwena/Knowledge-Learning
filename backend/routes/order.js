const express = require('express');
const router = express.Router();
const orderService = require('../services/order');
const private = require('../middlewares/private')


router.post('/', private.checkJWT, orderService.createOrder);
router.get('/user/:userId', orderService.getOrdersByUser);
router.get('/:orderId', orderService.getOrderById)
router.put('/:orderId', orderService.updateOrderStatus);

module.exports = router;
