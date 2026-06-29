const AboutSection = require('../models/AboutSection');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Get all active about page sections (Public)
// @route   GET /api/about
// @access  Public
exports.getAboutSections = asyncHandler(async (req, res, next) => {
  const sections = await AboutSection.find({ isActive: true }).sort({ sortOrder: 1 });

  res.status(200).json({
    success: true,
    count: sections.length,
    data: sections
  });
});

// @desc    Get all about sections (Admin only)
// @route   GET /api/about/admin
// @access  Private (Admin)
exports.getAboutSectionsAdmin = asyncHandler(async (req, res, next) => {
  const sections = await AboutSection.find().sort({ sortOrder: 1 });

  res.status(200).json({
    success: true,
    count: sections.length,
    data: sections
  });
});

// @desc    Update an about section (Admin only)
// @route   PUT /api/about/:key
// @access  Private (Admin)
exports.updateAboutSection = asyncHandler(async (req, res, next) => {
  const { key } = req.params;
  const { title, subtitle, content, sortOrder, isActive } = req.body;

  let section = await AboutSection.findOne({ key: key.toLowerCase().trim() });

  if (!section) {
    return next(new AppError(`About section not found with key of ${key}`, 404));
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
