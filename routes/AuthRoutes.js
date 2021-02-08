const express = require('express');

const authController = require('../controllers/AuthController');

const router = express.Router();

router.route('/login').post(authController.login);
router.route('/register').post(authController.register);
router.route('/is-logged-in').get(authController.isLoggedIn);
router.route('/logout').get(authController.logout);

module.exports = router;
