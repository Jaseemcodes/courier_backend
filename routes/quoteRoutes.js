const express = require('express');
const { createQuote, getQuotes, getQuote, updateQuote, deleteQuote } = require('../controllers/quoteController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public route for calculator
router.post('/', createQuote);

// Admin / Staff protected routes
router.use(protect, authorize('superadmin', 'admin', 'staff'));
router.get('/', getQuotes);
router.get('/:id', getQuote);
router.put('/:id', updateQuote);
router.delete('/:id', deleteQuote);

module.exports = router;
