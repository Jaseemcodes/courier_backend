const PrivacyPolicy = require('../models/PrivacyPolicy');
const asyncHandler = require('../middlewares/asyncHandler');
const AppError = require('../utils/AppError');

// @desc    Get Privacy Policy details (Public)
// @route   GET /api/privacy-policy
// @access  Public
exports.getPrivacyPolicy = asyncHandler(async (req, res, next) => {
  let policy = await PrivacyPolicy.findOne();

  // If no document exists, seed it with the default values from user's request screenshot
  if (!policy) {
    const defaultContent = `<p>Thank you for visiting our website</p>
<p>Greetings of the day!</p>
<ol>
  <li>You can access our website without heisting as we don't ask for personal information.</li>
  <li>You have to provide personal Information once you proceed with booking medicine courier with us. (This information is not disclosed to any person or firm or organization) Hence only used for Pick-up and Delivery of your parcel.</li>
  <li>Our website use cookies to store your information as every time you don't need to enter your information its fetch your details. Cookies are store in your device hardware you can delete/ erase it anytime.</li>
  <li>Your information is required to dispatch your parcel and hence this is shared with carrier just for the delivery address purpose.</li>
  <li>On our website the payment information you provide or enter is just to make payment towards courier charges or service you are availing with us.</li>
  <li>We may disclose your Personal information wherever it's required for legal purpose.</li>
  <li>You contact us via Email Call and WhatsApp and we ensure these Mail call and chats are kept private, as sometime the history is required to fetch your query so every time you contact, we can process faster.</li>
  <li>Your Call may be recorded for Internal training and quality purposes only.</li>
  <li>Feel free to contact us via Email Call or WhatsApp if any more information is required, we will be happy to help and answer your concern.</li>
</ol>`;

    policy = await PrivacyPolicy.create({
      title: 'Privacy Policy',
      bgImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80',
      content: defaultContent,
    });
  }

  res.status(200).json({
    success: true,
    data: policy,
  });
});

// @desc    Update Privacy Policy details (Admin only)
// @route   PUT /api/privacy-policy
// @access  Private
exports.updatePrivacyPolicy = asyncHandler(async (req, res, next) => {
  let policy = await PrivacyPolicy.findOne();

  if (!policy) {
    policy = new PrivacyPolicy();
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
