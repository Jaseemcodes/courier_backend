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
