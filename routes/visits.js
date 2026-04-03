const express = require('express');
const router = express.Router();
const { getVisits, createVisit, updateVisit, deleteVisit } = require('../controllers/visitController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getVisits);
router.post('/', protect, createVisit);
router.put('/:id', protect, updateVisit);
router.delete('/:id', protect, authorize('superadmin', 'admin', 'sales_manager'), deleteVisit);

module.exports = router;
