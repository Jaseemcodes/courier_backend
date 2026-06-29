const express = require('express');
const { createOrder, getOrders, getOrder, updateOrder, updateOrderStatus, deleteOrder, createPublicOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Public checkout order endpoint
router.post('/public', createPublicOrder);

// Admin / Staff protected routes
router.use(protect, authorize('superadmin', 'admin', 'staff'));
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
