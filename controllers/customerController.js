const Customer = require('../models/Customer');

exports.getCustomers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.search) filter.$or = [
      { name: new RegExp(req.query.search, 'i') },
      { phone: new RegExp(req.query.search, 'i') },
      { email: new RegExp(req.query.search, 'i') }
    ];
    const customers = await Customer.find(filter).populate('createdBy', 'name').sort('-createdAt');
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('createdBy', 'name');
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    // Get bookings for customer
    const bookings = await require('../models/Booking').find({ customer: req.params.id }).populate('property', 'title');
    const payments = await require('../models/Payment').find({ customer: req.params.id }).sort('-paymentDate');
    res.json({ success: true, customer, bookings, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
