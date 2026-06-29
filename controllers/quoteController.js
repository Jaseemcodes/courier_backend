const QuoteRequest = require('../models/QuoteRequest');
const Country = require('../models/Country');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Create a quote request (Public calculator)
// @route   POST /api/quotes
// @access  Public
exports.createQuote = asyncHandler(async (req, res, next) => {
  const { country, countryName, location, locationName, medicineType, mobile, hasPrescription, notes } = req.body;

  if (!country || !location || !medicineType || !mobile) {
    return next(new AppError('Please provide country, location, medicineType and mobile number', 400));
  }

  // 1. Look up Country model by code to get basePrice
  const countryObj = await Country.findOne({ code: country.toUpperCase(), isDeleted: false });
  if (!countryObj) {
    return next(new AppError(`Country code '${country}' is not supported or not found.`, 404));
  }

  const basePrice = countryObj.basePrice;
  let estimatedPrice = Math.round(basePrice);

  // 3. Generate bookingRef as 'CM-' + 6 random digits
  let bookingRef;
  let isUnique = false;
  while (!isUnique) {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    bookingRef = `CM-${randomDigits}`;
    const existing = await QuoteRequest.findOne({ bookingRef });
    if (!existing) {
      isUnique = true;
    }
  }

  // 4. Timeline
  const estimatedTimeline = country.toUpperCase() === 'AE' ? '2-3 Business Days' : '3-5 Business Days';

  // 5. Save to database
  const quote = await QuoteRequest.create({
    country: country.toUpperCase(),
    countryName: countryName || countryObj.name,
    location,
    locationName,
    medicineType,
    mobile,
    hasPrescription: hasPrescription || 'YES',
    estimatedPrice,
    estimatedTimeline,
    bookingRef,
    status: 'new',
    source: 'website',
    notes: notes || ''
  });

  res.status(201).json({
    success: true,
    data: quote
  });
});

// @desc    Get all quotes (Admin only)
// @route   GET /api/quotes
// @access  Private
exports.getQuotes = asyncHandler(async (req, res, next) => {
  const filter = { isDeleted: false };

  // Filtering by status
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Search by mobile or bookingRef
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [
      { mobile: searchRegex },
      { bookingRef: searchRegex },
      { countryName: searchRegex },
      { locationName: searchRegex }
    ];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const total = await QuoteRequest.countDocuments(filter);
  const data = await QuoteRequest.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('assignedTo', 'name email');

  res.status(200).json({
    success: true,
    count: data.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data
  });
});

// @desc    Get a single quote
// @route   GET /api/quotes/:id
// @access  Private
exports.getQuote = asyncHandler(async (req, res, next) => {
  const quote = await QuoteRequest.findOne({ _id: req.params.id, isDeleted: false })
    .populate('assignedTo', 'name email');

  if (!quote) {
    return next(new AppError(`Quote not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: quote
  });
});

// @desc    Update quote status/notes
// @route   PUT /api/quotes/:id
// @access  Private
exports.updateQuote = asyncHandler(async (req, res, next) => {
  let quote = await QuoteRequest.findOne({ _id: req.params.id, isDeleted: false });

  if (!quote) {
    return next(new AppError(`Quote not found with id of ${req.params.id}`, 404));
  }

  // Fields to update
  const { status, notes, assignedTo } = req.body;

  if (status) quote.status = status;
  if (notes !== undefined) quote.notes = notes;
  if (assignedTo) quote.assignedTo = assignedTo;

  await quote.save();

  res.status(200).json({
    success: true,
    data: quote
  });
});

// @desc    Delete quote (soft delete)
// @route   DELETE /api/quotes/:id
// @access  Private
exports.deleteQuote = asyncHandler(async (req, res, next) => {
  const quote = await QuoteRequest.findOne({ _id: req.params.id, isDeleted: false });

  if (!quote) {
    return next(new AppError(`Quote not found with id of ${req.params.id}`, 404));
  }

  quote.isDeleted = true;
  quote.deletedAt = Date.now();
  await quote.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});
