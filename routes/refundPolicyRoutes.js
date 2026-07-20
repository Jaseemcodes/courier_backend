const express = require('express');
const router = express.Router();
const {
  getRefundPolicy,
  updateRefundPolicy,
} = require('../controllers/refundPolicyController');
const { protect, authorize } = require('../middlewares/auth');

// Public route
router.get('/', getRefundPolicy);

// Protected route (Admin/Superadmin only)
router.put('/', protect, authorize('superadmin', 'admin'), updateRefundPolicy);

module.exports = router;
