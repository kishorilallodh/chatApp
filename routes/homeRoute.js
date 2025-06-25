const express = require('express');
const router = express.Router();

const homecontroller = require('../Controllers/homeController');

// Home Page    
router.get('/', homecontroller.homePage);

module.exports = router;