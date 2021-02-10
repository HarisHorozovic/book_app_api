const express = require('express');

const authController = require('../controllers/AuthController');

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login to the app
 *     description: Login to get access to the CRUD operations of the app, login returns a JWT and saves it to the cookie.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's name.
 *               password:
 *                 type: string
 *                 description: The users password.
 *     responses:
 *       '200':
 *         description: Login success
 *       '404':
 *         description: Incorrect username or passsword
 */

router.route('/login').post(authController.login);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register new user
 *     description: Register new user, after successful register, log in the user.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's name.
 *               password:
 *                 type: string
 *                 description: The users password.
 *     responses:
 *       '200':
 *         description: User created and logged in
 *       '500':
 *         description: Server error
 */
router.route('/register').post(authController.register);

/**
 * @swagger
 * /api/v1/auth/is-logged-in:
 *   get:
 *     summary: Check if the user is logged in
 *     description: Check if te user is logged in using the cooke with jwt that was set on login.
 *     tags:
 *       - users
 *     responses:
 *       '200':
 *         description: Logged in, can proceed
 *       '401':
 *         description: User not logged in, access denied
 */
router.route('/is-logged-in').get(authController.isLoggedIn);
/**
 * @swagger
 * /api/v1/auth/logout:
 *   get:
 *     summary: Logout the user
 *     description: Logout the user, with this protected operations are now unavailable.
 *     tags:
 *       - users
 *     responses:
 *       '200':
 *         description: Successfull logout
 */
router.route('/logout').get(authController.logout);

module.exports = router;
