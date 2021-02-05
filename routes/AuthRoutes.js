const express = require('express');

const authController = require('../controllers/AuthController');

const router = express.Router();

router.route('/').get(authController.login).post(authController.register);
router.route('/logout').get(authController.logout);

module.exports = router;
