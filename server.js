require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');

const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Connect to Database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const contactRoutes = require('./routes/contactRoutes');
const orderRoutes = require('./routes/orderRoutes');
const countryRoutes = require('./routes/countryRoutes');
const locationRoutes = require('./routes/locationRoutes');
const blogRoutes = require('./routes/blogRoutes');
const faqRoutes = require('./routes/faqRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const homepageRoutes = require('./routes/homepageRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const providerRoutes = require('./routes/providerRoutes');
const refundPolicyRoutes = require('./routes/refundPolicyRoutes');
const privacyPolicyRoutes = require('./routes/privacyPolicyRoutes');

const app = express();

// Body parser with size limits to prevent large payload attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitize MongoDB inputs against NoSQL injection attacks
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Global Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  message: { success: false, error: 'Too many requests, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', apiLimiter);

// Stricter Rate Limiter for Login route to protect against brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 login attempts per windowMs
  message: { success: false, error: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/auth/login', loginLimiter);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Enable CORS with secure restricted origins
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : ['http://localhost:3000', 'http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      (process.env.NODE_ENV !== 'production' && (
                        origin.startsWith('http://localhost:') || 
                        origin.startsWith('http://192.168.')
                      ));
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/refund-policy', refundPolicyRoutes);
app.use('/api/privacy-policy', privacyPolicyRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Courier Medicines REST API. Reference API documentation for endpoints.'
  });
});

// Catch-all route (404)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
