const express = require('express');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const telegramService = require('../services/telegram');

const router = express.Router();

// Get user withdrawals
router.get('/', async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ withdrawals });
  } catch (error) {
    console.error('Get withdrawals error:', error);
    res.status(500).json({ message: 'Server error fetching withdrawals' });
  }
});

// Create withdrawal request
router.post('/', async (req, res) => {
  try {
    const { amount, paymentMethod, accountDetails } = req.body;
    const userId = req.user._id;

    // Validate amount
    if (amount < 1000) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is 1000 ETB' });
    }

    if (amount > req.user.balance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Validate account details
    if (paymentMethod === 'bank') {
      if (!accountDetails.accountNumber || !accountDetails.bankName) {
        return res.status(400).json({ message: 'Bank account details are required' });
      }
    } else if (paymentMethod === 'telebirr') {
      if (!accountDetails.phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required for TeleBirr' });
      }
    }

    // Create withdrawal request
    const withdrawal = new Withdrawal({
      user: userId,
      amount,
      paymentMethod,
      accountDetails
    });

    await withdrawal.save();

    // Deduct amount from user balance (pending withdrawal)
    await User.findByIdAndUpdate(userId, {
      $inc: { balance: -amount }
    });

    // Send notification to admin
    await telegramService.sendToAdmin(
      `💸 New withdrawal request:\n` +
      `User: ${req.user.fullName}\n` +
      `Amount: ${amount.toLocaleString()} ETB\n` +
      `Method: ${paymentMethod}\n` +
      `Details: ${JSON.stringify(accountDetails, null, 2)}`
    );

    res.status(201).json({
      message: 'Withdrawal request submitted successfully',
      withdrawal
    });
  } catch (error) {
    console.error('Create withdrawal error:', error);
    res.status(500).json({ message: 'Server error creating withdrawal request' });
  }
});

module.exports = router;