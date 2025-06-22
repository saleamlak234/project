const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AdminRole = require('../models/AdminRole');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Admin login with enhanced security
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    // Check admin role
    const adminRole = await AdminRole.findOne({ user: user._id });
    if (!adminRole || !adminRole.isActive) {
      return res.status(403).json({ message: 'Admin access not configured' });
    }

    // Check if account is locked
    if (adminRole.isLocked()) {
      return res.status(423).json({ 
        message: 'Account is locked due to multiple failed login attempts. Please try again later.' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await adminRole.incLoginAttempts();
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    // Reset login attempts on successful login
    await adminRole.resetLoginAttempts();
    
    // Update last login
    adminRole.lastLogin = new Date();
    await adminRole.save();

    user.lastLoginAt = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role, adminRole: adminRole.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '8h' } // Shorter session for admin
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Admin login successful',
      token,
      user: userResponse,
      adminRole: {
        role: adminRole.role,
        permissions: adminRole.permissions
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});

// Get admin profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const adminRole = await AdminRole.findOne({ user: req.user._id });
    
    res.json({
      user: req.user,
      adminRole: adminRole ? {
        role: adminRole.role,
        permissions: adminRole.permissions,
        lastLogin: adminRole.lastLogin
      } : null
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create admin role (super admin only)
router.post('/create-role', authMiddleware, async (req, res) => {
  try {
    const { userId, role, permissions } = req.body;

    // Check if current user is super admin
    const currentAdminRole = await AdminRole.findOne({ user: req.user._id });
    if (!currentAdminRole || currentAdminRole.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only super admin can create admin roles' });
    }

    // Check if user exists and is admin
    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(400).json({ message: 'User not found or not an admin' });
    }

    // Check if admin role already exists
    const existingRole = await AdminRole.findOne({ user: userId });
    if (existingRole) {
      return res.status(400).json({ message: 'Admin role already exists for this user' });
    }

    // Define default permissions based on role
    let defaultPermissions = [];
    switch (role) {
      case 'super_admin':
        defaultPermissions = [
          'view_users', 'edit_users', 'delete_users',
          'view_transactions', 'process_transactions',
          'view_reports', 'manage_merchants', 'system_settings'
        ];
        break;
      case 'view_admin_1':
      case 'view_admin_2':
        defaultPermissions = ['view_users', 'view_transactions', 'view_reports'];
        break;
    }

    const adminRole = new AdminRole({
      user: userId,
      role,
      permissions: permissions || defaultPermissions
    });

    await adminRole.save();

    res.status(201).json({
      message: 'Admin role created successfully',
      adminRole
    });
  } catch (error) {
    console.error('Create admin role error:', error);
    res.status(500).json({ message: 'Server error creating admin role' });
  }
});

module.exports = router;