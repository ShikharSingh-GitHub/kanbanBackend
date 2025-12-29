const express = require('express');
const { getCurrentUser, createOrUpdateProfile } = require('../controllers/userController');
const verifyToken = require('../middleware/auth');
const router = express.Router();

router.get('/me', verifyToken, getCurrentUser);
router.post('/me', verifyToken, createOrUpdateProfile);

module.exports = router;
