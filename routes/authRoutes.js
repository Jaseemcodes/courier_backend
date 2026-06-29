const express = require('express');
const { register, login, getMe, updatePassword } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', protect, authorize('superadmin'), register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);

module.exports = router;
