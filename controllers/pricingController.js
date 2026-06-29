const Pricing = require('../models/Pricing');
const AppError = require('../utils/AppError');

// @desc    Get all pricing data
// @route   GET /api/pricing
// @access  Public
exports.getAllPricing = async (req, res, next) => {
  try {
    const pricing = await Pricing.find().sort({ country: 1 });
    res.status(200).json({
      success: true,
      count: pricing.length,
      data: pricing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pricing for a specific country
// @route   GET /api/pricing/:country
// @access  Public
exports.getPricingByCountry = async (req, res, next) => {
  try {
    const pricing = await Pricing.findOne({ country: req.params.country });
    
    if (!pricing) {
      return next(new AppError(`No pricing found for country ${req.params.country}`, 404));
    }

    res.status(200).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create pricing for a country
// @route   POST /api/pricing
// @access  Private/Admin
exports.createPricing = async (req, res, next) => {
  try {
    // Check if pricing already exists for this country
    const existing = await Pricing.findOne({ country: req.body.country });
    if (existing) {
      return next(new AppError(`Pricing already exists for ${req.body.country}. Use update instead.`, 400));
    }

    const pricing = await Pricing.create(req.body);

    res.status(201).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pricing for a country
// @route   PUT /api/pricing/:id
// @access  Private/Admin
exports.updatePricing = async (req, res, next) => {
  try {
    const pricing = await Pricing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!pricing) {
      return next(new AppError(`No pricing found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pricing for a country
// @route   DELETE /api/pricing/:id
// @access  Private/Admin
exports.deletePricing = async (req, res, next) => {
  try {
    const pricing = await Pricing.findByIdAndDelete(req.params.id);

    if (!pricing) {
      return next(new AppError(`No pricing found with id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
