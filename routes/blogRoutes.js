const express = require('express');
const { 
  getBlogs, 
  getBlogBySlug, 
  createBlog, 
  updateBlog, 
  deleteBlog,
  getBlogHeader,
  updateBlogHeader
} = require('../controllers/blogController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/header', getBlogHeader);
router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);

// Admin / Staff routes
router.put('/header', protect, authorize('superadmin', 'admin'), updateBlogHeader);
router.post('/', protect, authorize('superadmin', 'admin'), createBlog);
router.put('/:id', protect, authorize('superadmin', 'admin'), updateBlog);
router.delete('/:id', protect, authorize('superadmin', 'admin'), deleteBlog);

module.exports = router;

