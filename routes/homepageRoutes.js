const express = require('express');
const router = express.Router();
const { 
  getHomepageSections, 
  getHomepageSectionsAdmin, 
  updateHomepageSection 
} = require('../controllers/homepageController');
const { protect, authorize } = require('../middlewares/auth');

// Public route
router.get('/', getHomepageSections);

// Protected routes (Admin only)
router.get('/admin', protect, authorize('superadmin', 'admin'), getHomepageSectionsAdmin);
router.put('/:key', protect, authorize('superadmin', 'admin'), updateHomepageSection);

module.exports = router;
