const mongoose = require('mongoose');

/**
 * HomepageSection Model
 * Stores structural and text content for custom home page components.
 * Enables the page builder / section management module.
 */
const HomepageSectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Section key is required'],
      unique: true,
      trim: true,
      lowercase: true
    },
    name: {
      type: String,
      required: [true, 'Section display name is required'],
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // flexible container for slides, accordions, processes etc.
    },
    sortOrder: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('HomepageSection', HomepageSectionSchema);
