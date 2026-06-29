const express = require('express');
const { 
  submitContact, 
  getContacts, 
  getContact, 
  updateContact, 
  deleteContact,
  getContactHeader,
  updateContactHeader,
  getContactSections,
  getContactSectionsAdmin,
  updateContactSection
} = require('../controllers/contactController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.get('/sections', getContactSections);
router.get('/header', getContactHeader);
router.post('/', submitContact);

// Admin / Staff protected routes
router.use(protect, authorize('superadmin', 'admin', 'staff'));
router.get('/sections/admin', authorize('superadmin', 'admin'), getContactSectionsAdmin);
router.put('/sections/:key', authorize('superadmin', 'admin'), updateContactSection);
router.put('/header', authorize('superadmin', 'admin'), updateContactHeader);
router.get('/', getContacts);
router.get('/:id', getContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

module.exports = router;
