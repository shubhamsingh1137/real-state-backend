const express = require('express');
const router = express.Router();
const { getSalesReport, getAgentPerformance } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/sales', protect, authorize('superadmin', 'admin', 'sales_manager', 'accountant'), getSalesReport);
router.get('/agent-performance', protect, authorize('superadmin', 'admin', 'sales_manager'), getAgentPerformance);

module.exports = router;
