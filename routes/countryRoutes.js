const express = require('express');
const { getCountries, getCountryBySlug, createCountry, updateCountry, deleteCountry } = require('../controllers/countryController');
const { protect, authorize } = require('../middlewares/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

const cpUpload = upload.fields([
  { name: 'processImage1', maxCount: 1 },
  { name: 'processImage2', maxCount: 1 },
  { name: 'processImage3', maxCount: 1 },
  { name: 'processImage4', maxCount: 1 },
  { name: 'processImage5', maxCount: 1 },
  { name: 'documentImage', maxCount: 1 }
]);

// Public routes
router.get('/', getCountries);
router.get('/:slug', getCountryBySlug);

// Admin / Staff routes
router.post('/', protect, authorize('superadmin', 'admin'), cpUpload, createCountry);
router.put('/:id', protect, authorize('superadmin', 'admin'), cpUpload, updateCountry);
router.delete('/:id', protect, authorize('superadmin', 'admin'), deleteCountry);

module.exports = router;
