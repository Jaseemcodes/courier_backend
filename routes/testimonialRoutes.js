const express = require('express');
const { getTestimonials, submitTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes (GET lists & POST new feedback)
router.get('/', getTestimonials);
router.post('/', submitTestimonial);

// Admin / Staff moderation routes
router.use(protect, authorize('superadmin', 'admin'));
router.put('/:id', updateTestimonial);
router.delete('/:id', deleteTestimonial);

module.exports = router;
