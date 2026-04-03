const Booking = require('../models/Booking');
const Property = require('../models/Property');

exports.getBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.user.role === 'agent') filter.agent = req.user._id;
    const bookings = await Booking.find(filter)
      .populate('customer', 'name phone email')
      .populate('property', 'title location price')
      .populate('agent', 'name')
      .sort('-createdAt');
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer').populate('property').populate('agent', 'name email').populate('lead', 'name phone');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, createdBy: req.user._id });
    // Mark property as booked
    await Property.findByIdAndUpdate(req.body.property, { status: 'booked' });
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (req.body.status === 'completed') {
      await Property.findByIdAndUpdate(booking.property, { status: 'sold' });
    }
    if (req.body.status === 'cancelled') {
      await Property.findByIdAndUpdate(booking.property, { status: 'available' });
    }
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
