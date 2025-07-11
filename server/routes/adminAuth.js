const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AdminRole = require("../models/AdminRole");
const authMiddleware = require("../middleware/auth");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Admin login with enhanced security
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, role: "admin" });
    if (!user) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    // Check admin role
    const adminRole = await AdminRole.findOne({ user: user._id });
    if (!adminRole || !adminRole.isActive) {
      return res.status(403).json({ message: "Admin access not configured" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    // Update last login
    adminRole.lastLogin = new Date();
    await adminRole.save();

    user.lastLoginAt = new Date();
    await user.save();

    // Generate token with shorter expiration for admin
    const token = jwt.sign(
      { userId: user._id, role: user.role, adminRole: adminRole.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "8h" } // Shorter session for admin
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: "Admin login successful",
      token,
      user: userResponse,
      adminRole: {
        role: adminRole.role,
        permissions: adminRole.permissions,
        lastLogin: adminRole.lastLogin,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during admin login" });
  }
});

// Create a new admin (super admin only)
router.post("/create-admin", authMiddleware, async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role } = req.body;

    // Only super admin can create new admins
    const currentAdminRole = await AdminRole.findOne({
      user: req.user._id,
    });
    if (!currentAdminRole || currentAdminRole.role !== "super_admin") {
      return res
        .status(403)
        .json({ message: "Only super admin can create admins" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Generate unique referral code
    let newReferralCode;
    let isUnique = false;
    while (!isUnique) {
      newReferralCode = generateReferralCode();
      const existing = await User.findOne({ referralCode: newReferralCode });
      if (!existing) isUnique = true;
    }

    // Create user with admin role
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role: "admin",
      referralCode: newReferralCode,
      isActive: true,
    });
    await newUser.save();

    // Assign admin role and permissions
    let adminRoleName = role || "view_admin_1";
    let permissions = [];
    switch (adminRoleName) {
      case "super_admin":
        permissions = [
          "view_users",
          "edit_users",
          "delete_users",
          "view_transactions",
          "process_transactions",
          "view_reports",
          "manage_merchants",
          "system_settings",
          "create_admin",
        ];
        break;
      case "view_admin_1":
      default:
        permissions = ["view_users", "view_transactions", "view_reports"];
        break;
    }

    const newAdminRole = new AdminRole({
      user: newUser._id,
      role: adminRoleName,
      permissions,
      isActive: true,
    });
    await newAdminRole.save();

    res.status(201).json({
      message: "Admin created successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
      },
      adminRole: newAdminRole,
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ message: "Server error creating admin" });
  }
});

// Get admin profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const adminRole = await AdminRole.findOne({ user: req.user._id });

    res.json({
      user: req.user,
      adminRole: adminRole
        ? {
            role: adminRole.role,
            permissions: adminRole.permissions,
            lastLogin: adminRole.lastLogin,
          }
        : null,
    });
  } catch (error) {
    console.error("Get admin profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper function to generate referral code
function generateReferralCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = router;