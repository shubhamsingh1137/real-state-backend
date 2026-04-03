const SiteVisit = require('../models/SiteVisit');

exports.getVisits = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.user.role === 'agent') filter.agent = req.user._id;
    const visits = await SiteVisit.find(filter)
      .populate('lead', 'name phone')
      .populate('property', 'title location')
      .populate('agent', 'name')
      .sort('-scheduledDate');
    res.json({ success: true, visits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createVisit = async (req, res) => {
  try {
    const visit = await SiteVisit.create({ ...req.body, createdBy: req.user._id });
    // Update lead status
    await require('../models/Lead').findByIdAndUpdate(req.body.lead, { status: 'site_visit' });
    res.status(201).json({ success: true, visit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateVisit = async (req, res) => {
  try {
    const visit = await SiteVisit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });
    res.json({ success: true, visit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteVisit = async (req, res) => {
  try {
    await SiteVisit.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Visit deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
