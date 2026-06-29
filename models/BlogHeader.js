const mongoose = require('mongoose');

const BlogHeaderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Our Blog",
    },
    subtitle: {
      type: String,
      default: "Regulations & Updates, shipping schedules, and critical logistics advisories for international prescription parcels.",
    },
    tag: {
      type: String,
      default: "Regulations & Updates",
    },
    bgImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogHeader', BlogHeaderSchema);
