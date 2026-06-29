require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Import models
const Country = require('../models/Country');
const Location = require('../models/Location');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const BlogPost = require('../models/BlogPost');
const SiteSettings = require('../models/SiteSettings');
const User = require('../models/User');
const Order = require('../models/Order');
const QuoteRequest = require('../models/QuoteRequest');
const ContactSubmission = require('../models/ContactSubmission');

// Import data
const countriesData = require('./countriesData');
const locationsData = require('./locationsData');
const testimonialsData = require('./testimonialsData');
const faqsData = require('./faqsData');
const blogsData = require('./blogsData');

// Connect to database
connectDB();

const importData = async () => {
  try {
    console.log('⏳ Clearing existing data...');
    await Country.deleteMany();
    await Location.deleteMany();
    await Testimonial.deleteMany();
    await FAQ.deleteMany();
    await BlogPost.deleteMany();
    await SiteSettings.deleteMany();
    await User.deleteMany();
    // Note: order, quote and contact tables are not seeded but cleared during fresh seed if desired.
    // Let's clear them too for a clean state.
    await Order.deleteMany();
    await QuoteRequest.deleteMany();
    await ContactSubmission.deleteMany();
    console.log('✅ Collections cleared.');

    // 1. Seed Countries
    console.log(`⏳ Seeding ${countriesData.length} countries...`);
    await Country.insertMany(countriesData);
    console.log('✅ Countries seeded.');

    // 2. Seed Locations
    console.log(`⏳ Seeding ${locationsData.length} locations...`);
    await Location.insertMany(locationsData);
    console.log('✅ Locations seeded.');

    // 3. Seed Testimonials
    console.log(`⏳ Seeding ${testimonialsData.length} testimonials...`);
    await Testimonial.insertMany(testimonialsData);
    console.log('✅ Testimonials seeded.');

    // 4. Seed FAQs
    console.log(`⏳ Seeding ${faqsData.length} FAQs...`);
    await FAQ.insertMany(faqsData);
    console.log('✅ FAQs seeded.');

    // 5. Seed Blogs
    console.log(`⏳ Seeding ${blogsData.length} blog posts...`);
    await BlogPost.insertMany(blogsData);
    console.log('✅ Blogs seeded.');

    // 6. Seed SiteSettings
    console.log('⏳ Seeding global site settings...');
    await SiteSettings.create({
      phone: '+91-8882691919',
      whatsapp: '+91-8882691919',
      email: 'couriermedicines@gmail.com',
      workingHours: 'Mon - Sat 09:00 - 19:00',
      address: 'Shop No. 7, 1st Floor, Market, Block C, Nizamuddin West, New Delhi, Delhi-110013',
      socialLinks: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
        twitter: 'https://twitter.com'
      },
      aboutText: 'Courier Medicines Offers Free Pick Up Service All Across India with providing Medicine Procurement Facilities also...',
      copyright: '2024 © All Rights Reserved, Courier Services'
    });
    console.log('✅ Site settings seeded.');

    // 7. Seed Default SuperAdmin
    console.log('⏳ Creating default superadmin user...');
    await User.create({
      name: 'Admin',
      email: 'admin@couriermedicines.com',
      password: 'admin123', // Will be hashed automatically by User pre-save hook
      role: 'superadmin',
      isActive: true
    });
    console.log('✅ Superadmin created (admin@couriermedicines.com / admin123).');

    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log('⏳ Purging all database collections...');
    await Country.deleteMany();
    await Location.deleteMany();
    await Testimonial.deleteMany();
    await FAQ.deleteMany();
    await BlogPost.deleteMany();
    await SiteSettings.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();
    await QuoteRequest.deleteMany();
    await ContactSubmission.deleteMany();
    console.log('✅ Database fully purged.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error purging database:', error);
    process.exit(1);
  }
};

// Check argument
if (process.argv.includes('--destroy')) {
  destroyData();
} else {
  importData();
}
