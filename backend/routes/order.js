import express from 'express';
const router = express.Router();

import orderService from '../services/order.js';
import middleware from '../middlewares/private.js';

router.post('/', middleware.checkJWT, orderService.createOrder);
router.get('/user/:userId', orderService.getOrdersByUser);
router.get('/:orderId', orderService.getOrderById);
router.put('/:orderId', orderService.updateOrderStatus);

export default router;
