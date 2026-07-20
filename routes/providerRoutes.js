const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');
const { protect, authorize } = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');

// Get all providers (Public)
router.get('/', asyncHandler(async (req, res, next) => {
  const providers = await Provider.find().sort({ name: 1 });
  res.status(200).json({ success: true, count: providers.length, data: providers });
}));

// Create a provider (Admin only)
router.post('/', protect, authorize('superadmin', 'admin'), asyncHandler(async (req, res, next) => {
  try {
    const provider = await Provider.create(req.body);
    res.status(201).json({ success: true, data: provider });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError('Provider name already exists', 400));
    }
    next(err);
  }
}));

// Update a provider (Admin only)
router.put('/:id', protect, authorize('superadmin', 'admin'), asyncHandler(async (req, res, next) => {
  try {
    const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!provider) {
      return next(new AppError('Provider not found', 404));
    }

    res.status(200).json({ success: true, data: provider });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError('Provider name already exists', 400));
    }
    next(err);
  }
}));

// Delete a provider (Admin only)
router.delete('/:id', protect, authorize('superadmin', 'admin'), asyncHandler(async (req, res, next) => {
  const provider = await Provider.findByIdAndDelete(req.params.id);

  if (!provider) {
    return next(new AppError('Provider not found', 404));
  }

  res.status(200).json({ success: true, data: {} });
}));

module.exports = router;
