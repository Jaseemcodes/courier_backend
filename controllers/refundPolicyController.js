const RefundPolicy = require('../models/RefundPolicy');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');

// @desc    Get Refund Policy details (Public)
// @route   GET /api/refund-policy
// @access  Public
exports.getRefundPolicy = asyncHandler(async (req, res, next) => {
  let policy = await RefundPolicy.findOne();

  // If no document exists, seed it with the default values from user's request screenshot
  if (!policy) {
    const defaultContent = `<p>Welcome to Courier Medicines</p>
<p>Greetings of the day!</p>
<ol>
  <li>To request a refund, please contact us via email, phone, or our online help centre. Be sure to provide your Courier Medicines booking ID or tracking ID.</li>
  <li>Only the sender or receiver whosoever has made payment is responsible to claim for refund.</li>
  <li>Refunds will be credited back using the original payment method.</li>
  <li>Refund amount will be processed through the same online payment method used for the original transaction.</li>
  <li>It takes 72-96 Hours to process the refund amount, as we verify original payment source.</li>
  <li>If the shipment is processed for Destination Country it cannot be cancelled Neither amount will be refunded</li>
</ol>
<p>For more Information of Refund Policy, you can contact our Team they will guide you well.</p>
<p>Thank you for Trust in Courier Medicines!</p>`;

    policy = await RefundPolicy.create({
      title: 'Refund Policy',
      bgImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80',
      content: defaultContent,
    });
  }

  res.status(200).json({
    success: true,
    data: policy,
  });
});

// @desc    Update Refund Policy details (Admin only)
// @route   PUT /api/refund-policy
// @access  Private
exports.updateRefundPolicy = asyncHandler(async (req, res, next) => {
  let policy = await RefundPolicy.findOne();

  if (!policy) {
    policy = new RefundPolicy();
  }

  const { title, bgImage, content } = req.body;

  if (title !== undefined) policy.title = title;
  if (bgImage !== undefined) policy.bgImage = bgImage;
  if (content !== undefined) policy.content = content;

  await policy.save();

  res.status(200).json({
    success: true,
    data: policy,
  });
});
