const mongoose = require('mongoose');

/**
 * Country Model
 * Stores supported destination countries with base pricing.
 * Used by the quote calculator on the frontend.
 */
const CountrySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Country code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Country name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
    },
    advice: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },

    // --- CMS Fields ---
    heroTitle: { type: String, default: "" },
    introHeading: { type: String, default: "" },
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
    docHeading: { type: String, default: "" },
    doc1Title: { type: String, default: "" },
    doc1Content: { type: String, default: "" },
    doc2Title: { type: String, default: "" },
    doc2Content: { type: String, default: "" },
    doc3Title: { type: String, default: "" },
    doc3Content: { type: String, default: "" },

    servicesWeOffer: { type: String, default: "" },
    serviceHeading: { type: String, default: "" },
    service1Title: { type: String, default: "" },
    service1Content: { type: String, default: "" },
    service2Title: { type: String, default: "" },
    service2Content: { type: String, default: "" },
    service3Title: { type: String, default: "" },
    service3Content: { type: String, default: "" },
    service4Title: { type: String, default: "" },
    service4Content: { type: String, default: "" },

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

module.exports = mongoose.model('Country', CountrySchema);
