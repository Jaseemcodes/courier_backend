const express = require('express');
const router = express.Router();
const { 
  getHomepageSections, 
  getHomepageSectionsAdmin, 
  updateHomepageSection 
} = require('../controllers/homepageController');
const { protect } = require('../middlewares/auth');

// Public route
router.get('/', getHomepageSections);

// Protected routes (Admin only)
router.get('/admin', protect, getHomepageSectionsAdmin);
router.put('/:key', protect, updateHomepageSection);

module.exports = router;
