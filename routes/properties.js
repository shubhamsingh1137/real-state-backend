const express = require('express');
const router = express.Router();
const { getProperties, getProperty, createProperty, updateProperty, deleteProperty } = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getProperties);
router.get('/:id', protect, getProperty);
router.post('/', protect, authorize('superadmin', 'admin', 'sales_manager'), createProperty);
router.put('/:id', protect, authorize('superadmin', 'admin', 'sales_manager'), updateProperty);
router.delete('/:id', protect, authorize('superadmin', 'admin'), deleteProperty);

module.exports = router;
