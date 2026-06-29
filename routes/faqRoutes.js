const express = require('express');
const { 
  getFAQs, 
  createFAQ, 
  updateFAQ, 
  deleteFAQ,
  getFAQHeader,
  updateFAQHeader
} = require('../controllers/faqController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/header', getFAQHeader);
router.get('/', getFAQs);

// Admin / Staff routes
router.put('/header', protect, authorize('superadmin', 'admin'), updateFAQHeader);
router.post('/', protect, authorize('superadmin', 'admin'), createFAQ);
router.put('/:id', protect, authorize('superadmin', 'admin'), updateFAQ);
router.delete('/:id', protect, authorize('superadmin', 'admin'), deleteFAQ);

module.exports = router;
