const User = require('../models/User');

const seedSuperAdmin = async () => {
  try {
    const existing = await User.findOne({ role: 'superadmin' });
    if (!existing) {
      await User.create({
        name: process.env.SUPERADMIN_NAME || 'Super Admin',
        email: process.env.SUPERADMIN_EMAIL || 'superadmin@realestate.com',
        password: process.env.SUPERADMIN_PASSWORD || 'SuperAdmin@123',
        role: 'superadmin',
        isActive: true,
        phone: '0000000000'
      });
      console.log('✅ SuperAdmin created:', process.env.SUPERADMIN_EMAIL);
    } else {
      console.log('✅ SuperAdmin already exists');
    }
  } catch (err) {
    console.error('SuperAdmin seed error:', err.message);
  }
};

module.exports = seedSuperAdmin;
