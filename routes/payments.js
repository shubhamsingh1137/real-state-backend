const express = require('express');
const router = express.Router();
const { getPayments, createPayment, updatePayment, deletePayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('superadmin', 'admin', 'sales_manager', 'accountant'), getPayments);
router.post('/', protect, authorize('superadmin', 'admin', 'accountant'), createPayment);
router.put('/:id', protect, authorize('superadmin', 'admin', 'accountant'), updatePayment);
router.delete('/:id', protect, authorize('superadmin', 'admin'), deletePayment);

module.exports = router;
