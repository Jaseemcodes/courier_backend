const HomepageSection = require('../models/HomepageSection');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Get all active homepage sections (Public)
// @route   GET /api/homepage
// @access  Public
exports.getHomepageSections = asyncHandler(async (req, res, next) => {
  const sections = await HomepageSection.find({ isActive: true }).sort({ sortOrder: 1 });

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.status(200).json({
    success: true,
    count: sections.length,
    data: sections
  });
});

// @desc    Get all homepage sections (Admin only)
// @route   GET /api/homepage/admin
// @access  Private (Admin)
exports.getHomepageSectionsAdmin = asyncHandler(async (req, res, next) => {
  const sections = await HomepageSection.find().sort({ sortOrder: 1 });

  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.status(200).json({
    success: true,
    count: sections.length,
    data: sections
  });
});

// @desc    Update a homepage section (Admin only)
// @route   PUT /api/homepage/:key
// @access  Private (Admin)
exports.updateHomepageSection = asyncHandler(async (req, res, next) => {
  const { key } = req.params;
  const { title, subtitle, content, sortOrder, isActive } = req.body;

  let section = await HomepageSection.findOne({ key: key.toLowerCase().trim() });

  if (!section) {
    return next(new AppError(`Homepage section not found with key of ${key}`, 404));
  }

  if (title !== undefined) section.title = title;
  if (subtitle !== undefined) section.subtitle = subtitle;
  if (content !== undefined) {
    section.content = content;
    section.markModified('content');
  }
  if (sortOrder !== undefined) section.sortOrder = sortOrder;
  if (isActive !== undefined) section.isActive = isActive;

  await section.save();

  res.status(200).json({
    success: true,
    data: section
  });
});
