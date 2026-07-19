const mongoose = require('mongoose');

/**
 * Location Model
 * Pickup locations / cities from which medicines can be collected.
 * Each location belongs to a country and has a unique locationId
 * used by the frontend dropdown.
 */
const LocationSchema = new mongoose.Schema(
  {
    locationId: {
      type: String,
      required: [true, 'Location ID is required'],
      unique: true,
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // --- CMS Fields ---
    metaViewTitle: { type: String, default: "" },
    metaKeywords: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    
    // Images
    processImage1: { type: String, default: "" },
    processImage2: { type: String, default: "" },
    processImage3: { type: String, default: "" },
    processImage4: { type: String, default: "" },
    processImage5: { type: String, default: "" },
    documentImage: { type: String, default: "" },
    
    // Pricing Matrix (Array of objects)
    pricingMatrix: [
      {
        weight: { type: String },
        deliveryDays: { type: String },
        charges: { type: String }
      }
    ],
    
    // Rich Text Content
    medicineCourierServices: { type: String, default: "" },
    documentsNeeded: { type: String, default: "" },
    servicesWeOffer: { type: String, default: "" },
    process1: { type: String, default: "" },
    process2: { type: String, default: "" },
    faq: { type: String, default: "" },
    faqHeading: { type: String, default: "" },
    faq1Q: { type: String, default: "" },
    faq1A: { type: String, default: "" },
    faq2Q: { type: String, default: "" },
    faq2A: { type: String, default: "" },
    faq3Q: { type: String, default: "" },
    faq3A: { type: String, default: "" },
    faq4Q: { type: String, default: "" },
    faq4A: { type: String, default: "" },
    faq5Q: { type: String, default: "" },
    faq5A: { type: String, default: "" },
    faq6Q: { type: String, default: "" },
    faq6A: { type: String, default: "" },
    faq7Q: { type: String, default: "" },
    faq7A: { type: String, default: "" },
    faq8Q: { type: String, default: "" },
    faq8A: { type: String, default: "" },
    faq9Q: { type: String, default: "" },
    faq9A: { type: String, default: "" },
    faq10Q: { type: String, default: "" },
    faq10A: { type: String, default: "" },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Soft-delete fields
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Location', LocationSchema);
