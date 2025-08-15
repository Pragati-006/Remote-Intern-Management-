const express = require('express');
const router = express.Router();
const { registerUser, authUser, getMe } = require('../controllers/User');
const { protect } = require('../middleware/authMiddleware');

module.exports = router;

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/me', protect, getMe);

module.exports = router;
