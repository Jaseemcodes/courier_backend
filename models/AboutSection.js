const mongoose = require('mongoose');

const AboutSectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true, // e.g. "about-hero", "about-welcome", "about-vision-mission"
    },
    name: {
      type: String,
      required: true, // Human-readable name
    },
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // Stores section-specific structures (cards, vision/mission, texts)
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AboutSection', AboutSectionSchema);
