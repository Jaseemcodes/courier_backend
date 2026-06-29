const express = require('express');
const {
  getAllPricing,
  getPricingByCountry,
  createPricing,
  updatePricing,
  deletePricing
} = require('../controllers/pricingController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.route('/').get(getAllPricing);
router.route('/country/:country').get(getPricingByCountry);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .post(createPricing);

router.route('/:id')
  .put(updatePricing)
  .delete(deletePricing);

module.exports = router;
