const Testimonial = require('../models/Testimonial');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Get all approved testimonials (Public)
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = asyncHandler(async (req, res, next) => {
  const filter = { isDeleted: false };

  // Public views only approved testimonials, admin can see all
  if (!req.query.all || req.query.all !== 'true') {
    filter.isApproved = true;
  }

  // Filter by featured
  if (req.query.featured === 'true') {
    filter.isFeatured = true;
  }

  const testimonials = await Testimonial.find(filter).sort({ sortOrder: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: testimonials
  });
});

// @desc    Submit a new testimonial (Public review submission)
// @route   POST /api/testimonials
// @access  Public
exports.submitTestimonial = asyncHandler(async (req, res, next) => {
  const { name, rating, country, review, avatar, designation, date } = req.body;

  if (!name || !rating || !review) {
    return next(new AppError('Please provide name, rating, and review text', 400));
  }

  // Auto generate avatar initials if not provided
  let finalAvatar = avatar;
  if (!finalAvatar) {
    const initials = name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
    finalAvatar = initials.slice(0, 2);
  }

  // Create testimonial (by default it can be approved or require admin approval)
  // Let's make it approved by default as requested in frontend, or set approval false if we want admin screening
  // The requirement says: isApproved default true, but admin can toggle it.
  const testimonial = await Testimonial.create({
    name,
    rating,
    country: country || 'International',
    avatar: finalAvatar,
    review,
    designation: designation || 'Verified Customer',
    date: date || 'Just now',
    isApproved: true, // Auto-approve or set false if desired. Let's stick to Mongoose default (true)
    isFeatured: false
  });

  res.status(201).json({
    success: true,
    data: testimonial
  });
});

// @desc    Update/Approve/Feature testimonial (Admin only)
// @route   PUT /api/testimonials/:id
// @access  Private
exports.updateTestimonial = asyncHandler(async (req, res, next) => {
  let testimonial = await Testimonial.findOne({ _id: req.params.id, isDeleted: false });

  if (!testimonial) {
    return next(new AppError(`Testimonial not found with id of ${req.params.id}`, 404));
  }

  const { name, rating, country, review, avatar, designation, date, isApproved, isFeatured, sortOrder } = req.body;

  if (name) testimonial.name = name;
  if (rating !== undefined) testimonial.rating = rating;
  if (country) testimonial.country = country;
  if (review) testimonial.review = review;
  if (avatar) testimonial.avatar = avatar;
  if (designation) testimonial.designation = designation;
  if (date) testimonial.date = date;
  if (isApproved !== undefined) testimonial.isApproved = isApproved;
  if (isFeatured !== undefined) testimonial.isFeatured = isFeatured;
  if (sortOrder !== undefined) testimonial.sortOrder = sortOrder;

  await testimonial.save();

  res.status(200).json({
    success: true,
    data: testimonial
  });
});

// @desc    Soft delete testimonial (Admin only)
// @route   DELETE /api/testimonials/:id
// @access  Private
exports.deleteTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findOne({ _id: req.params.id, isDeleted: false });

  if (!testimonial) {
    return next(new AppError(`Testimonial not found with id of ${req.params.id}`, 404));
  }

  testimonial.isDeleted = true;
  testimonial.deletedAt = Date.now();
  await testimonial.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});
