const express = require('express');
const { getLocations, getLocationBySlug, getLocationsByCity, createLocation, updateLocation, deleteLocation } = require('../controllers/locationController');
const { protect, authorize } = require('../middlewares/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

// Public routes
router.get('/', getLocations);
router.get('/city/:city', getLocationsByCity); // MUST be before /:slug
router.get('/:slug', getLocationBySlug);

const cpUpload = upload.fields([
  { name: 'processImage1', maxCount: 1 },
  { name: 'processImage2', maxCount: 1 },
  { name: 'processImage3', maxCount: 1 },
  { name: 'processImage4', maxCount: 1 },
  { name: 'processImage5', maxCount: 1 },
  { name: 'documentImage', maxCount: 1 }
]);

// Admin / Staff routes
router.post('/', protect, authorize('superadmin', 'admin'), cpUpload, createLocation);
router.put('/:id', protect, authorize('superadmin', 'admin'), cpUpload, updateLocation);
router.delete('/:id', protect, authorize('superadmin', 'admin'), deleteLocation);

module.exports = router;
