import express from "express";
const router = express.Router();

import service from "../services/user.js";
import middleware from "../middlewares/private.js";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API to manage users.
 */

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Get all users
 *     description: Return all users. Requires authentication
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       200:
 *         description: Users list found successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server internal error
 */
router.get("/", middleware.checkJWT, service.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a specific user by ID
 *     description: Return a specific user by ID. Requires authentication.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to retrieve
 *     responses:
 *       200:
 *         description: User found successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server internal error
 */
router.get("/:id", middleware.checkJWT, service.getById);

/**
 * @swagger
 * /users/add:
 *   post:
 *     summary: Add a new user
 *     description: create a new user. Requires authentication and admin rights.
 *     tags:
 *       - Users
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
 *         description: User created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Unauthorized - Admin rights required
 *       500:
 *         description: Server internal error
 */
router.post("/add", middleware.checkJWT, middleware.checkAdmin, service.add);

/**
 * @swagger
 * /users/update/{id}:
 *   patch:
 *     summary: Update a user
 *     description: Update an existing user. Requires authentication.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to update
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
 *         description: User updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server internal error
 */
router.patch("/update/:id", middleware.checkJWT, service.update);

/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete an existing user. Requires authentication and admin rights.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server internal error
 */
router.delete(
  "/delete/:id",
  middleware.checkJWT,
  middleware.checkAdmin,
  service.delete
);

/**
 * @swagger
 * /users/authenticate:
 *   post:
 *     summary: Authenticate a user
 *     description: Verify user credentials and return a JWT token.
 *     tags:
 *       - Authentication
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
 *         description: Authentication successful, JWT token returned
 *       400:   
 *         description: Invalid data
 *       500:
 *         description: Server internal error
 */
router.post("/authenticate", service.authenticate);

/**
 * @swagger
 * /users/lessons/{lessonId}/complete:
 *   patch:
 *     summary: Mark a lesson as completed
 *     description: Mark a specific lesson as completed for the authenticated user.
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
 *         description: Lesson ID to mark as completed
 *     responses:
 *       200:
 *         description: Lesson marked as completed successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Server internal error
 */
router.patch(
  "/lessons/:lessonId/complete",
  middleware.checkJWT,
  service.markLessonAsCompleted
);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user and send a confirmation email.
 *     tags:
 *       - Authentication
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
 *         description: Registration successful, confirmation email sent
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server internal error
 */
router.post("/register", service.registerUser);

/**
 * @swagger
 * /users/confirm/{token}:
 *   get:
 *     summary: Confirm registration
 *     description: Verify the registration token and confirm the user registration.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration token to verify
 *     responses:
 *       200:
 *         description: Registration confirmed successfully
 *       400:
 *         description: Invalid token
 *       500:
 *         description: Server internal error
 */
router.get("/confirm/:token", service.confirmRegistration);

export default router;
