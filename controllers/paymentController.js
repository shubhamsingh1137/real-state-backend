const Payment = require('../models/Payment');

exports.getPayments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.booking) filter.booking = req.query.booking;
    const payments = await Payment.find(filter)
      .populate('customer', 'name phone')
      .populate('property', 'title')
      .populate('booking')
      .sort('-paymentDate');
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
