const express = require('express');
const router = express.Router();
const {
  getPrivacyPolicy,
  updatePrivacyPolicy,
} = require('../controllers/privacyPolicyController');
const { protect, authorize } = require('../middlewares/auth');

// Public route
router.get('/', getPrivacyPolicy);

// Protected route (Admin/Superadmin only)
router.put('/', protect, authorize('superadmin', 'admin'), updatePrivacyPolicy);

module.exports = router;
