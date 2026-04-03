const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, getUser, updateUser, deleteUser, resetUserPassword } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const adminRoles = ['superadmin', 'admin'];

router.get('/', protect, authorize(...adminRoles, 'sales_manager'), getAllUsers);
router.post('/', protect, authorize(...adminRoles), createUser);
router.get('/:id', protect, authorize(...adminRoles), getUser);
router.put('/:id', protect, authorize(...adminRoles), updateUser);
router.delete('/:id', protect, authorize('superadmin', 'admin'), deleteUser);
router.put('/:id/reset-password', protect, authorize('superadmin', 'admin'), resetUserPassword);

module.exports = router;
