const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, authorize } = require('../middlewares/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, authorize('superadmin', 'admin'), upload.fields([
  { name: 'processImage1', maxCount: 1 },
  { name: 'processImage2', maxCount: 1 },
  { name: 'processImage3', maxCount: 1 },
  { name: 'processImage4', maxCount: 1 },
  { name: 'processImage5', maxCount: 1 },
  { name: 'documentImage', maxCount: 1 },
  { name: 'countryHeroImage', maxCount: 1 }
]), updateSettings);

module.exports = router;
