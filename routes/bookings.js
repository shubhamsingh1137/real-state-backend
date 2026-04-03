const express = require('express');
const router = express.Router();
const { getBookings, getBooking, createBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getBookings);
router.get('/:id', protect, getBooking);
router.post('/', protect, authorize('superadmin', 'admin', 'sales_manager', 'agent'), createBooking);
router.put('/:id', protect, authorize('superadmin', 'admin', 'sales_manager'), updateBooking);
router.delete('/:id', protect, authorize('superadmin', 'admin'), deleteBooking);

module.exports = router;
