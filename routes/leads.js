const express = require('express');
const router = express.Router();
const { getLeads, getLead, createLead, updateLead, deleteLead, addFollowUp } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getLeads);
router.get('/:id', protect, getLead);
router.post('/', protect, createLead);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, authorize('superadmin', 'admin', 'sales_manager'), deleteLead);
router.post('/:id/followup', protect, addFollowUp);

module.exports = router;
