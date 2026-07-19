const mongoose = require('mongoose');

/**
 * PrivacyPolicy Model
 * Singleton document storing the privacy policy details.
 */
const PrivacyPolicySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Privacy Policy',
      trim: true,
    },
    bgImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80',
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PrivacyPolicy', PrivacyPolicySchema);
