const Property = require('../models/Property');
const Lead = require('../models/Lead');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const SiteVisit = require('../models/SiteVisit');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const [
      totalProperties, availableProperties, bookedProperties, soldProperties,
      totalLeads, newLeads, totalBookings, totalCustomers,
      totalRevenue, pendingPayments, totalVisits
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: 'available' }),
      Property.countDocuments({ status: 'booked' }),
      Property.countDocuments({ status: 'sold' }),
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'new' }),
      Booking.countDocuments(),
      Customer.countDocuments(),
      Payment.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Payment.aggregate([{ $match: { status: 'pending' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      SiteVisit.countDocuments()
    ]);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'completed', paymentDate: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$paymentDate' }, year: { $year: '$paymentDate' } }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Lead sources
    const leadSources = await Lead.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    // Lead status distribution
    const leadStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent bookings
    const recentBookings = await Booking.find().populate('customer', 'name').populate('property', 'title').sort('-createdAt').limit(5);

    res.json({
      success: true,
      stats: {
        properties: { total: totalProperties, available: availableProperties, booked: bookedProperties, sold: soldProperties },
        leads: { total: totalLeads, new: newLeads },
        bookings: totalBookings,
        customers: totalCustomers,
        revenue: { total: totalRevenue[0]?.total || 0, pending: pendingPayments[0]?.total || 0 },
        visits: totalVisits
      },
      monthlyRevenue,
      leadSources,
      leadStatus,
      recentBookings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    const bookings = await Booking.find(filter)
      .populate('customer', 'name phone')
      .populate('property', 'title price')
      .populate('agent', 'name');
    const totalSales = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalCommission = bookings.reduce((sum, b) => sum + (b.commission || 0), 0);
    res.json({ success: true, bookings, totalSales, totalCommission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAgentPerformance = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent', isActive: true });
    const performance = await Promise.all(agents.map(async (agent) => {
      const [leads, visits, bookings, revenue] = await Promise.all([
        Lead.countDocuments({ assignedTo: agent._id }),
        SiteVisit.countDocuments({ agent: agent._id }),
        Booking.countDocuments({ agent: agent._id }),
        Payment.aggregate([
          { $match: { createdBy: agent._id, status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
      ]);
      return { agent: { _id: agent._id, name: agent.name, email: agent.email }, leads, visits, bookings, revenue: revenue[0]?.total || 0 };
    }));
    res.json({ success: true, performance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
