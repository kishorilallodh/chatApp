const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });

const authController = require('../Controllers/authController');
const { verifyUser } = require('../middleware/authMiddleware');
const chatController = require('../Controllers/chatController');

// Register
router.get('/register', authController.getRegister);
router.post('/register', upload.single('image'), authController.postRegister); // 👈 Image supported

// Login
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Logout
router.get('/logout', authController.logout);

// Chat Page
router.get('/chat', verifyUser, chatController.getChatPage);

module.exports = router;
