const BlogPost = require('../models/BlogPost');
const BlogHeader = require('../models/BlogHeader');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Get all published blogs (Public)
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = asyncHandler(async (req, res, next) => {
  const filter = { isDeleted: false };

  // Public views only published blogs, admin can see all
  if (!req.query.all || req.query.all !== 'true') {
    filter.isPublished = true;
  }

  // Filter by category
  if (req.query.category) {
    filter.category = req.query.category;
  }

  // Search by title or tags
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [
      { title: searchRegex },
      { tags: searchRegex }
    ];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const total = await BlogPost.countDocuments(filter);
  const data = await BlogPost.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: data.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data
  });
});

// @desc    Get single blog by slug and increment views (Public)
// @route   GET /api/blogs/:slug
// @access  Public
exports.getBlogBySlug = asyncHandler(async (req, res, next) => {
  // Find blog
  const blog = await BlogPost.findOneAndUpdate(
    { slug: req.params.slug.toLowerCase(), isDeleted: false },
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!blog) {
    return next(new AppError(`Blog not found with slug of ${req.params.slug}`, 404));
  }

  res.status(200).json({
    success: true,
    data: blog
  });
});

// @desc    Create a blog post (Admin only)
// @route   POST /api/blogs
// @access  Private
exports.createBlog = asyncHandler(async (req, res, next) => {
  const { title, excerpt, content, image, author, category, tags, readTime, isPublished, introParagraph, sections, tip } = req.body;

  if (!title || !excerpt || !content) {
    return next(new AppError('Please provide title, excerpt, and content', 400));
  }

  // Generate slug
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  // Check if slug exists
  const slugExists = await BlogPost.findOne({ slug, isDeleted: false });
  if (slugExists) {
    return next(new AppError('A blog with a similar title/slug already exists', 400));
  }

  const blog = await BlogPost.create({
    title,
    slug,
    excerpt,
    content,
    image,
    author: author || 'Admin',
    category: category || 'General',
    tags: tags || [],
    readTime: readTime || '3 min read',
    isPublished: isPublished || false,
    publishedAt: isPublished ? Date.now() : null,
    introParagraph: introParagraph || '',
    sections: sections || [],
    tip: tip || ''
  });

  res.status(201).json({
    success: true,
    data: blog
  });
});

// @desc    Update a blog post (Admin only)
// @route   PUT /api/blogs/:id
// @access  Private
exports.updateBlog = asyncHandler(async (req, res, next) => {
  let blog = await BlogPost.findOne({ _id: req.params.id, isDeleted: false });

  if (!blog) {
    return next(new AppError(`Blog not found with id of ${req.params.id}`, 404));
  }

  const { title, excerpt, content, image, author, category, tags, readTime, isPublished, introParagraph, sections, tip } = req.body;

  if (title) {
    blog.title = title;
    blog.slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  if (excerpt) blog.excerpt = excerpt;
  if (content) blog.content = content;
  if (image !== undefined) blog.image = image;
  if (author) blog.author = author;
  if (category) blog.category = category;
  if (tags) blog.tags = tags;
  if (readTime) blog.readTime = readTime;
  if (introParagraph !== undefined) blog.introParagraph = introParagraph;
  if (sections !== undefined) blog.sections = sections;
  if (tip !== undefined) blog.tip = tip;
  
  if (isPublished !== undefined) {
    if (isPublished && !blog.isPublished) {
      blog.publishedAt = Date.now();
    }
    blog.isPublished = isPublished;
  }

  await blog.save();

  res.status(200).json({
    success: true,
    data: blog
  });
});

// @desc    Soft delete blog (Admin only)
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await BlogPost.findOne({ _id: req.params.id, isDeleted: false });

  if (!blog) {
    return next(new AppError(`Blog not found with id of ${req.params.id}`, 404));
  }

  blog.isDeleted = true;
  blog.deletedAt = Date.now();
  await blog.save();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get Blog page header configuration (Public)
// @route   GET /api/blogs/header
// @access  Public
exports.getBlogHeader = asyncHandler(async (req, res, next) => {
  let header = await BlogHeader.findOne();

  // Create default header if not exists
  if (!header) {
    header = await BlogHeader.create({
      title: "Our Blog",
      subtitle: "Regulations & Updates, shipping schedules, and critical logistics advisories for international prescription parcels.",
      tag: "Regulations & Updates",
      bgImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80"
    });
  }

  res.status(200).json({
    success: true,
    data: header
  });
});

// @desc    Update Blog page header configuration (Admin only)
// @route   PUT /api/blogs/header
// @access  Private (Admin)
exports.updateBlogHeader = asyncHandler(async (req, res, next) => {
  const { title, subtitle, tag, bgImage } = req.body;

  let header = await BlogHeader.findOne();

  if (!header) {
    header = new BlogHeader();
  }

  if (title !== undefined) header.title = title;
  if (subtitle !== undefined) header.subtitle = subtitle;
  if (tag !== undefined) header.tag = tag;
  if (bgImage !== undefined) header.bgImage = bgImage;

  await header.save();

  res.status(200).json({
    success: true,
    data: header
  });
});
