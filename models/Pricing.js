const mongoose = require('mongoose');

const ProviderPricingSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: [true, 'Provider name is required (e.g., DHL, UPS)'],
    trim: true
  },
  halfKgPrice: {
    type: Number,
    required: [true, '0.5 KG price is required']
  },
  oneKgPrice: {
    type: Number,
    required: [true, '1 KG price is required']
  },
  timeline: {
    type: String,
    required: [true, 'Estimated timeline is required (e.g., 4-6 Days)'],
    trim: true
  }
});

const PricingSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Country name is required'],
    unique: true,
    trim: true
  },
  providers: [ProviderPricingSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Pricing', PricingSchema);
