const Order = require('../models/Order');
const QuoteRequest = require('../models/QuoteRequest');
const ContactSubmission = require('../models/ContactSubmission');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Get dashboard stats (Admin only)
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = asyncHandler(async (req, res, next) => {
  // Start of today
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // 1. Core Counts
  const totalOrders = await Order.countDocuments({ isDeleted: false });
  const totalQuotes = await QuoteRequest.countDocuments({ isDeleted: false });
  const totalContacts = await ContactSubmission.countDocuments({ isDeleted: false });
  const unreadContacts = await ContactSubmission.countDocuments({ status: 'unread', isDeleted: false });
  const publicOrders = await Order.countDocuments({ 
    $or: [{ assignedTo: { $exists: false } }, { assignedTo: null }], 
    isDeleted: false 
  });
  
  const newQuotesToday = await QuoteRequest.countDocuments({
    createdAt: { $gte: startOfToday },
    isDeleted: false
  });



  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalOrders,
        totalQuotes,
        totalContacts,
        unreadContacts,
        newQuotesToday,
        publicOrders
      }
    }
  });
});
