const Order = require('../models/Order');
const QuoteRequest = require('../models/QuoteRequest');
const Pricing = require('../models/Pricing');
const Country = require('../models/Country');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Create a new order (Admin only)
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const {
    bookingRef,
    quoteRequest,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    originCity,
    originAddress,
    destinationCountry,
    destinationCountryCode,
    destinationAddress,
    destinationCity,
    medicineType,
    medicineList,
    hasPrescription,
    weight,
    basePrice,
    finalPrice,
    paymentStatus,
    status,
    currentLocation,
    courierPartner,
    courierTrackingId,
    estimatedDelivery,
    estimatedDeliveryTime,
    notes
  } = req.body;

  if (!customerName || !customerPhone || !originCity || !destinationCountry || !destinationAddress) {
    return next(new AppError('Please provide customerName, customerPhone, originCity, destinationCountry, and destinationAddress', 400));
  }

  // Generate bookingRef if not provided
  let finalBookingRef = bookingRef;
  if (!finalBookingRef) {
    let isUnique = false;
    while (!isUnique) {
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      finalBookingRef = `CM-${randomDigits}`;
      const existing = await Order.findOne({ bookingRef: finalBookingRef });
      if (!existing) {
        isUnique = true;
      }
    }
  } else {
    // Check if duplicate
    const existing = await Order.findOne({ bookingRef: finalBookingRef });
    if (existing) {
      return next(new AppError(`Order with booking reference '${finalBookingRef}' already exists`, 400));
    }
  }

  // Create order
  const order = await Order.create({
    bookingRef: finalBookingRef,
    quoteRequest: quoteRequest || null,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    originCity,
    originAddress,
    destinationCountry,
    destinationCountryCode,
    destinationAddress,
    destinationCity,
    medicineType,
    medicineList: medicineList || [],
    hasPrescription: hasPrescription === undefined ? true : hasPrescription,
    weight: weight || 0,
    basePrice: basePrice || 0,
    finalPrice: finalPrice || basePrice || 0,
    paymentStatus: paymentStatus || 'pending',
    status: status || 'booking_confirmed',
    currentLocation: currentLocation || originCity,
    courierPartner: courierPartner || '',
    courierTrackingId: courierTrackingId || '',
    estimatedDelivery: estimatedDelivery || null,
    assignedTo: req.user.id,
    notes: notes || '',
    trackingHistory: [
      {
        status: status || 'booking_confirmed',
        location: currentLocation || originCity,
        description: 'Order booking has been confirmed.',
        updatedBy: req.user.id
      }
    ]
  });

  // If order was created from a quote request, update the quote status
  if (quoteRequest) {
    await QuoteRequest.findByIdAndUpdate(quoteRequest, { status: 'confirmed' });
  }

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private
exports.getOrders = asyncHandler(async (req, res, next) => {
  const filter = { isDeleted: false };

  // Filters
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.destinationCountryCode) {
    filter.destinationCountryCode = req.query.destinationCountryCode.toUpperCase();
  }
  if (req.query.paymentStatus) {
    filter.paymentStatus = req.query.paymentStatus;
  }

  // Search by bookingRef, customerName, customerPhone, customerEmail
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [
      { bookingRef: searchRegex },
      { customerName: searchRegex },
      { customerPhone: searchRegex },
      { customerEmail: searchRegex }
    ];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const total = await Order.countDocuments(filter);
  const data = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('assignedTo', 'name email')
    .populate('quoteRequest');

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

// @desc    Get a single order details
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id, isDeleted: false })
    .populate('assignedTo', 'name email')
    .populate('quoteRequest')
    .populate('trackingHistory.updatedBy', 'name email');

  if (!order) {
    return next(new AppError(`Order not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order general details
// @route   PUT /api/orders/:id
// @access  Private
exports.updateOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findOne({ _id: req.params.id, isDeleted: false });

  if (!order) {
    return next(new AppError(`Order not found with id of ${req.params.id}`, 404));
  }

  // Update fields except status/tracking (use status route for status changes)
  const allowedUpdates = [
    'customerName', 'customerEmail', 'customerPhone', 'customerAddress',
    'originCity', 'originAddress', 'destinationCountry', 'destinationCountryCode',
    'destinationAddress', 'destinationCity', 'medicineType', 'medicineList',
    'hasPrescription', 'weight', 'basePrice', 'finalPrice', 'paymentStatus',
    'courierPartner', 'courierTrackingId', 'estimatedDelivery', 'notes', 'assignedTo'
  ];

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      order[field] = req.body[field];
    }
  });

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status and append to tracking history
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, currentLocation, description } = req.body;

  if (!status) {
    return next(new AppError('Please provide status', 400));
  }

  const order = await Order.findOne({ _id: req.params.id, isDeleted: false });

  if (!order) {
    return next(new AppError(`Order not found with id of ${req.params.id}`, 404));
  }

  // Update status & location
  order.status = status;
  if (currentLocation) {
    order.currentLocation = currentLocation;
  }

  // Default description if not provided
  let trackingDescription = description;
  if (!trackingDescription) {
    const statusDescriptions = {
      booking_confirmed: 'Order booking has been confirmed.',
      pickup_scheduled: 'Pickup scheduled.',
      picked_up: 'Shipment picked up.',
      reached_warehouse: 'Shipment reached central warehouse.',
      photo_verified: 'Prescription/Medicine photo verified.',
      documentation_prepared: 'Customs documentation prepared.',
      packing_done: 'Customized packaging done.',
      customs_clearance: 'Cleared through origin customs.',
      dispatched: 'Dispatched to destination country.',
      in_transit: 'In transit.',
      out_for_delivery: 'Out for delivery.',
      delivered: 'Delivered successfully.',
      cancelled: 'Order cancelled.',
      returned: 'Returned to origin.'
    };
    trackingDescription = statusDescriptions[status] || `Shipment status updated to ${status}.`;
  }

  // Push to history
  order.trackingHistory.push({
    status,
    location: currentLocation || order.currentLocation || 'N/A',
    description: trackingDescription,
    updatedBy: req.user.id
  });

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});



// @desc    Soft delete order
// @route   DELETE /api/orders/:id
// @access  Private
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id, isDeleted: false });

  if (!order) {
    return next(new AppError(`Order not found with id of ${req.params.id}`, 404));
  }

  order.isDeleted = true;
  order.deletedAt = Date.now();
  await order.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Create a public checkout order (No auth required)
// @route   POST /api/orders/public
// @access  Public
exports.createPublicOrder = asyncHandler(async (req, res, next) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    originAddress,
    originCity,
    destinationCountry,
    destinationAddress,
    medicineType,
    hasPrescription,
    weight,
    courierPartner,
    estimatedDeliveryTime,
    notes
  } = req.body;

  if (!customerName || !customerPhone || !originCity || !destinationCountry || !destinationAddress) {
    return next(new AppError('Please provide customerName, customerPhone, originCity, destinationCountry, and destinationAddress', 400));
  }

  // Calculate pricing server-side to prevent client-side price tampering/spoofing
  let calculatedPrice = 0;
  let basePriceVal = 0;
  const weightNum = parseFloat(weight || 0.5);

  // 1. Check custom pricing table by country name
  const countryPricing = await Pricing.findOne({ 
    country: { $regex: new RegExp(`^${destinationCountry.trim()}$`, 'i') } 
  });

  if (countryPricing && courierPartner) {
    const providerData = countryPricing.providers.find(
      p => p.provider.toUpperCase() === courierPartner.trim().toUpperCase()
    );
    if (providerData) {
      const { halfKgPrice, oneKgPrice } = providerData;
      if (weightNum <= 0.5) {
        calculatedPrice = halfKgPrice;
      } else if (weightNum <= 1.0) {
        calculatedPrice = oneKgPrice;
      } else {
        const diff = oneKgPrice - halfKgPrice;
        const extraWeight = weightNum - 1.0;
        const steps = Math.ceil(extraWeight / 0.5);
        calculatedPrice = oneKgPrice + (steps * diff);
      }
      basePriceVal = halfKgPrice;
    }
  }

  // 2. Fallback to Country collection base price calculation
  if (calculatedPrice === 0) {
    const countryObj = await Country.findOne({ 
      $or: [
        { name: { $regex: new RegExp(`^${destinationCountry.trim()}$`, 'i') } },
        { code: destinationCountry.trim().toUpperCase() }
      ],
      isDeleted: false 
    });
    if (countryObj) {
      basePriceVal = countryObj.basePrice;
      if (weightNum <= 0.5) {
        calculatedPrice = basePriceVal;
      } else if (weightNum <= 1.0) {
        calculatedPrice = basePriceVal + 1500;
      } else {
        const extraWeight = weightNum - 1.0;
        const steps = Math.ceil(extraWeight / 0.5);
        calculatedPrice = basePriceVal + 1500 + (steps * 1500);
      }
    } else {
      // 3. Absolute fallback
      basePriceVal = 3500;
      if (weightNum <= 0.5) {
        calculatedPrice = 3500;
      } else if (weightNum <= 1.0) {
        calculatedPrice = 5000;
      } else {
        const extraWeight = weightNum - 1.0;
        const steps = Math.ceil(extraWeight / 0.5);
        calculatedPrice = 5000 + (steps * 1500);
      }
    }
  }

  // Generate unique booking reference
  let bookingRef;
  let isUnique = false;
  while (!isUnique) {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    bookingRef = `CM-${randomDigits}`;
    const existing = await Order.findOne({ bookingRef });
    if (!existing) {
      isUnique = true;
    }
  }

  // Create public order
  const order = await Order.create({
    bookingRef,
    customerName,
    customerEmail,
    customerPhone,
    originAddress,
    originCity,
    destinationCountry,
    destinationAddress,
    medicineType,
    hasPrescription: hasPrescription === undefined ? true : hasPrescription,
    weight: weightNum,
    basePrice: Math.round(basePriceVal),
    finalPrice: Math.round(calculatedPrice),
    paymentStatus: 'pending',
    status: 'booking_confirmed',
    currentLocation: originCity,
    courierPartner: courierPartner || '',
    estimatedDeliveryTime: estimatedDeliveryTime || '',
    notes: notes || '',
    trackingHistory: [
      {
        status: 'booking_confirmed',
        location: originCity,
        description: 'Order booking has been confirmed.',
      }
    ]
  });

  res.status(201).json({
    success: true,
    data: order
  });
});



