const express = require('express');
const router = express.Router();
const { 
  getAboutSections, 
  getAboutSectionsAdmin, 
  updateAboutSection 
} = require('../controllers/aboutController');
const { protect } = require('../middlewares/auth');

// Public route
router.get('/', getAboutSections);

// Protected routes (Admin only)
router.get('/admin', protect, getAboutSectionsAdmin);
router.put('/:key', protect, updateAboutSection);

module.exports = router;
