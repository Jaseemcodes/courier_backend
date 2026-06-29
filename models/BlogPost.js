const mongoose = require('mongoose');

/**
 * BlogPost Model
 * CMS-managed blog articles for the public website.
 * Supports draft/published workflow, categories, tags,
 * and a view counter for analytics.
 */
const BlogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
    },
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    author: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
    },
    readTime: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
    introParagraph: {
      type: String,
      default: '',
    },
    sections: [
      {
        heading: { type: String, required: true },
        body: { type: String, required: true }
      }
    ],
    tip: {
      type: String,
      default: '',
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

module.exports = mongoose.model('BlogPost', BlogPostSchema);
