const mongoose = require('mongoose');

const ContactHeaderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Contact Us",
    },
    subtitle: {
      type: String,
      default: "Have questions about shipping prescription drugs internationally? Get in touch with our team.",
    },
    bgImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=1600&q=80",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactHeader', ContactHeaderSchema);
