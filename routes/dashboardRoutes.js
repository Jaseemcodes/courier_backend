const express = require('express');
const { getStats } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Only admin / staff / superadmin can view dashboard stats
router.get('/stats', protect, authorize('superadmin', 'admin', 'staff'), getStats);

module.exports = router;
