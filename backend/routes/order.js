import express from 'express';
const router = express.Router();

import orderService from '../services/order.js';
import middleware from '../middlewares/private.js';

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API to manage orders.
 */

/**
 * @swagger
 * /orders/:
 *   post:
 *     summary: Create a new order
 *     description: create a new order for the authenticated user.
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
 *         description: Order created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server internal error
 */
router.post('/', middleware.checkJWT, orderService.createOrder);

/**
 * @swagger
 * /orders/user/{userId}:
 *   get:
 *     summary: Get all orders by user
 *     description: Return all orders for a specific user.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to retrieve orders
 *     responses:
 *       200:
 *         description: Orders found successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: No orders found
 *       500:
 *         description: Server internal error
 */
router.get('/user/:userId', middleware.checkJWT, orderService.getOrdersByUser);

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get a specific order by ID
 *     description: Return a specific order by ID.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID to retrieve
 *     responses:
 *       200:
 *         description: Order found successfully
 *       400:
 *         description: Invalid order ID
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server internal error
 */
router.get('/:orderId', middleware.checkJWT, orderService.getOrderById);

/**
 * @swagger
 * /orders/{orderId}:
 *   put:
 *     summary: Update an existing order status
 *     description: Update an existing order status.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server internal error
 */
router.put('/:orderId', middleware.checkJWT, orderService.updateOrderStatus);

export default router;
