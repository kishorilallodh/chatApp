const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const { verifyUser } = require('../middleware/authMiddleware');
const chatController = require('../Controllers/chatController');
// Register
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Login
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Logout
router.get('/logout', authController.logout);

// Chat Page (Protected)
router.get('/chat', verifyUser,chatController.getChatPage);

module.exports = router;
