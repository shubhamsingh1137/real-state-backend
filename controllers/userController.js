const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.user.role !== 'superadmin' && req.user.role !== 'admin') {
      filter.role = { $nin: ['superadmin'] };
    }
    const users = await User.find(filter).sort('-createdAt');
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, address } = req.body;
    // Only superadmin can create admin/superadmin
    if ((role === 'superadmin' || role === 'admin') && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Only SuperAdmin can create Admin users' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone, role, address, createdBy: req.user._id });
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, phone, role, isActive, address } = req.body;
    if (role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Cannot assign superadmin role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { name, phone, role, isActive, address }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'superadmin') return res.status(403).json({ success: false, message: 'Cannot delete SuperAdmin' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
