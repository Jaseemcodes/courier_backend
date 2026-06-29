const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Provider name is required'],
    unique: true,
    trim: true
  },
  image: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Provider', ProviderSchema);
