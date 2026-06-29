const FAQ = require('../models/FAQ');
const FaqHeader = require('../models/FaqHeader');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Get all active FAQs (Public)
// @route   GET /api/faqs
// @access  Public
exports.getFAQs = asyncHandler(async (req, res, next) => {
  const filter = { isDeleted: false };

  if (!req.query.all || req.query.all !== 'true') {
    filter.isActive = true;
  }

  // Filter by category
  if (req.query.category) {
    filter.category = req.query.category;
  }

  const faqs = await FAQ.find(filter).sort({ sortOrder: 1, createdAt: 1 });

  res.status(200).json({
    success: true,
    count: faqs.length,
    data: faqs
  });
});

// @desc    Create a new FAQ (Admin only)
// @route   POST /api/faqs
// @access  Private
exports.createFAQ = asyncHandler(async (req, res, next) => {
  const { question, answer, category, sortOrder, isActive } = req.body;

  if (!question || !answer) {
    return next(new AppError('Please provide both question and answer', 400));
  }

  const faq = await FAQ.create({
    question,
    answer,
    category: category || 'general',
    sortOrder: sortOrder || 0,
    isActive: isActive === undefined ? true : isActive
  });

  res.status(201).json({
    success: true,
    data: faq
  });
});

// @desc    Update a FAQ (Admin only)
// @route   PUT /api/faqs/:id
// @access  Private
exports.updateFAQ = asyncHandler(async (req, res, next) => {
  let faq = await FAQ.findOne({ _id: req.params.id, isDeleted: false });

  if (!faq) {
    return next(new AppError(`FAQ not found with id of ${req.params.id}`, 404));
  }

  const { question, answer, category, sortOrder, isActive } = req.body;

  if (question) faq.question = question;
  if (answer) faq.answer = answer;
  if (category) faq.category = category;
  if (sortOrder !== undefined) faq.sortOrder = sortOrder;
  if (isActive !== undefined) faq.isActive = isActive;

  await faq.save();

  res.status(200).json({
    success: true,
    data: faq
  });
});

// @desc    Soft delete a FAQ (Admin only)
// @route   DELETE /api/faqs/:id
// @access  Private
exports.deleteFAQ = asyncHandler(async (req, res, next) => {
  const faq = await FAQ.findOne({ _id: req.params.id, isDeleted: false });

  if (!faq) {
    return next(new AppError(`FAQ not found with id of ${req.params.id}`, 404));
  }

  faq.isDeleted = true;
  faq.deletedAt = Date.now();
  await faq.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get FAQ page header configuration (Public)
// @route   GET /api/faqs/header
// @access  Public
exports.getFAQHeader = asyncHandler(async (req, res, next) => {
  let header = await FaqHeader.findOne();

  // Create default header if not exists
  if (!header) {
    header = await FaqHeader.create({
      title: "Frequently Asked Questions",
      bgImage: "https://images.unsplash.com/photo-1557425955-df376b5903c8?auto=format&fit=crop&w=1600&q=80"
    });
  }

  res.status(200).json({
    success: true,
    data: header
  });
});

// @desc    Update FAQ page header configuration (Admin only)
// @route   PUT /api/faqs/header
// @access  Private (Admin)
exports.updateFAQHeader = asyncHandler(async (req, res, next) => {
  const { title, bgImage } = req.body;

  let header = await FaqHeader.findOne();

  if (!header) {
    header = new FaqHeader();
  }

  if (title !== undefined) header.title = title;
  if (bgImage !== undefined) header.bgImage = bgImage;

  await header.save();

  res.status(200).json({
    success: true,
    data: header
  });
});
