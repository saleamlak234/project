const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const telegramService = require("../services/telegram");
const bcrypt = require("bcryptjs");
const sendEmail = require("../config/emailVerification"); // Assuming you have a utility for sending emails
const verifyEmailTemplate = require("../utils/verificationHtml"); //
const router = express.Router();

// Email transporter setup
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER || 'sahamtrading11@gmail.com',
//     pass: process.env.EMAIL_PASS || 'Saham@369'
//   }
// });

// Generate JWT token
const generateToken = ({ userId, role }) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "5hr",
  });
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, referralCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Find referrer if referral code provided
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return res.status(400).json({ message: "Invalid referral code" });
      }
    }

    // Generate unique referral code
    let newReferralCode;
    let isUnique = false;
    while (!isUnique) {
      newReferralCode = generateReferralCode();
      const existing = await User.findOne({ referralCode: newReferralCode });
      if (!existing) isUnique = true;
    }
    const hashPassword = await bcrypt.hash(password, 10);

    // Hash password before saving
    // const hashPassword = await bcrypt.hash(password, 10);

    // Create user with referrer if exists
    const user = new User({
      fullName,
      email,
      phoneNumber,
      password: hashPassword,
      referralCode: newReferralCode,
      referredBy: referrer ? referrer._id : undefined,
    });

    await user.save();

    // Update referrer's direct referrals count
    if (referrer) {
      await User.findByIdAndUpdate(referrer._id, {
        $inc: { directReferrals: 1, totalTeamSize: 1 },
      });

      // Update team sizes up the chain
      await updateTeamSizesUpChain(referrer._id);

      // Send welcome notification via Telegram
      if (referrer.telegramChatId) {
        await telegramService.sendMessage(
          referrer.telegramChatId,
          `🎉 New referral! ${fullName} just joined using your referral code.`
        );
      }
    }

    // Generate token
    const token = generateToken({ userId: user._id, role: user.role });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login with enhanced security
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if account is locked
    if (
      user.isLocked &&
      typeof user.isLocked === "function" &&
      user.isLocked()
    ) {
      const remainingTime = user.getRemainingLockoutTime
        ? user.getRemainingLockoutTime()
        : 0;
      return res.status(423).json({
        message: `Account is locked. Please try again in ${remainingTime} minutes.`,
        remainingMinutes: remainingTime,
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment login attempts if method exists
      if (
        user.incLoginAttempts &&
        typeof user.incLoginAttempts === "function"
      ) {
        await user.incLoginAttempts();
      }
      // Check if account is now locked
      const updatedUser = await User.findById(user._id);
      if (
        updatedUser &&
        updatedUser.isLocked &&
        typeof updatedUser.isLocked === "function" &&
        updatedUser.isLocked()
      ) {
        const remainingTime = updatedUser.getRemainingLockoutTime
          ? updatedUser.getRemainingLockoutTime()
          : 0;
        return res.status(423).json({
          message: `Too many failed login attempts. Account is now locked for ${remainingTime} minutes.`,
          remainingMinutes: remainingTime,
        });
      }
      // Calculate attempts left if available
      let attemptsLeft;
      if (
        user.maxLoginAttempts !== undefined &&
        user.loginAttempts !== undefined
      ) {
        attemptsLeft = user.maxLoginAttempts - (user.loginAttempts + 1);
      }
      return res.status(400).json({
        message:
          attemptsLeft !== undefined
            ? `Invalid email or password. ${attemptsLeft} attempts remaining before account lockout.`
            : "Invalid email or password",
        attemptsRemaining: attemptsLeft,
      });
    }

    // Reset login attempts on successful login if method exists
    if (
      user.loginAttempts > 0 &&
      user.resetLoginAttempts &&
      typeof user.resetLoginAttempts === "function"
    ) {
      await user.resetLoginAttempts();
    }

    // Check if account is active
    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Account is deactivated. Please contact support." });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate token
    const token = generateToken({ userId: user._id, role: user.role });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Get current user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Unlock account (admin only)
// router.post("/unlock-account", authMiddleware, async (req, res) => {
//   try {
//     const { userId } = req.body;

//     // Check if current user is admin
//     if (req.user.role !== "admin") {
//       return res
//         .status(403)
//         .json({ message: "Access denied. Admin privileges required." });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Reset login attempts and unlock account
//     await user.resetLoginAttempts();

//     res.json({ message: "Account unlocked successfully" });
//   } catch (error) {
//     console.error("Unlock account error:", error);
//     res.status(500).json({ message: "Server error unlocking account" });
//   }
// });

// Get account security info

// (Removed /security-info route)

// Forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Check if account is locked
    if (user.isLocked()) {
      const remainingTime = user.getRemainingLockoutTime();
      return res.status(423).json({
        message: `Account is locked. Please try again in ${remainingTime} minutes.`,
        remainingMinutes: remainingTime,
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}`;
    const resetEmail = await sendEmail({
      sendTo: email,
      subject: "Password Reset Request",
      html: verifyEmailTemplate({
        fullName: user.fullName,
        url: resetUrl,
      }),
    });

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error sending reset email" });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    // Update password and clear reset fields
    user.password = hashPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    // Reset login attempts when password is reset
    await user.resetLoginAttempts();

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error resetting password" });
  }
});

// Helper functions
function generateReferralCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function updateTeamSizesUpChain(userId) {
  const user = await User.findById(userId);
  if (user && user.referredBy) {
    await User.findByIdAndUpdate(user.referredBy, {
      $inc: { totalTeamSize: 1 },
    });
    await updateTeamSizesUpChain(user.referredBy);
  }
}

module.exports = router;
