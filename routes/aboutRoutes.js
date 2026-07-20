const express = require('express');
const router = express.Router();
const { 
  getAboutSections, 
  getAboutSectionsAdmin, 
  updateAboutSection 
} = require('../controllers/aboutController');
const { protect, authorize } = require('../middlewares/auth');

// Public route
router.get('/', getAboutSections);

// Protected routes (Admin only)
router.get('/admin', protect, authorize('superadmin', 'admin'), getAboutSectionsAdmin);
router.put('/:key', protect, authorize('superadmin', 'admin'), updateAboutSection);

module.exports = router;
