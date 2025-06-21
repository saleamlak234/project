const express = require('express');
const multer = require('multer');
const path = require('path');
const Deposit = require('../models/Deposit');
const User = require('../models/User');
const Commission = require('../models/Commission');
const chapaService = require('../services/chapa');
const telegramService = require('../services/telegram');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/receipts/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get user deposits
router.get('/', async (req, res) => {
  try {
    const deposits = await Deposit.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ deposits });
  } catch (error) {
    console.error('Get deposits error:', error);
    res.status(500).json({ message: 'Server error fetching deposits' });
  }
});

// Create new deposit
router.post('/', upload.single('receipt'), async (req, res) => {
  try {
    const { amount, package: packageName, paymentMethod } = req.body;
    const userId = req.user._id;

    // Validate package and amount
    const packagePrices = {
      '7th  Stock Package': 192000,
      '6th  Stock Package': 96000,
      '5th Stock Package': 48000,
      '4th Stock Package': 24000,
      '3rd Stock Package': 12000,
      '2nd Stock Package': 6000,
      '1st Stock Package': 3000
    };

    if (!packagePrices[packageName]) {
      return res.status(400).json({ message: 'Invalid package selected' });
    }

    if (parseInt(amount) !== packagePrices[packageName]) {
      return res.status(400).json({ message: 'Amount does not match package price' });
    }

    // Create deposit record
    const deposit = new Deposit({
      user: userId,
      amount: parseInt(amount),
      package: packageName,
      paymentMethod,
      receiptUrl: req.file ? `/uploads/receipts/${req.file.filename}` : null
    });

    await deposit.save();

    // If using Chapa payment, initiate payment
    if (paymentMethod.startsWith('chapa_')) {
      try {
        const paymentData = {
          amount: parseInt(amount),
          currency: 'ETB',
          email: req.user.email,
          first_name: req.user.fullName.split(' ')[0],
          last_name: req.user.fullName.split(' ').slice(1).join(' '),
          phone_number: req.user.phoneNumber,
          tx_ref: `DEP_${deposit._id}_${Date.now()}`,
          callback_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/callback`,
          return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/deposits`,
          customization: {
            title: 'Saham Trading Deposit',
            description: `Deposit for ${packageName}`
          }
        };

        const paymentResponse = await chapaService.initializePayment(paymentData);
        
        if (paymentResponse.status === 'success') {
          deposit.chapaReference = paymentData.tx_ref;
          await deposit.save();
          
          return res.json({
            message: 'Payment initialized',
            checkout_url: paymentResponse.data.checkout_url,
            deposit
          });
        }
      } catch (chapaError) {
        console.error('Chapa payment error:', chapaError);
        // Continue with manual processing if Chapa fails
      }
    }

    // Send notification to admin via Telegram
    await telegramService.sendToAdmin(
      `💰 New deposit request:\n` +
      `User: ${req.user.fullName}\n` +
      `Package: ${packageName}\n` +
      `Amount: ${amount.toLocaleString()} ETB\n` +
      `Payment: ${paymentMethod}`
    );

    res.status(201).json({
      message: 'Deposit request created successfully',
      deposit
    });
  } catch (error) {
    console.error('Create deposit error:', error);
    res.status(500).json({ message: 'Server error creating deposit' });
  }
});

// Process commission for approved deposit
async function processDepositCommissions(deposit) {
  try {
    const user = await User.findById(deposit.user).populate('referredBy');
    if (!user || !user.referredBy) return;

    const commissionRates = [0.08, 0.04, 0.02, 0.01]; // 8%, 4%, 2%, 1%
    let currentUser = user.referredBy;
    let level = 1;

    while (currentUser && level <= 4) {
      const commissionAmount = deposit.amount * commissionRates[level - 1];
      
      // Create commission record
      const commission = new Commission({
        user: currentUser._id,
        fromUser: deposit.user,
        amount: commissionAmount,
        level,
        type: 'deposit',
        description: `Level ${level} commission from ${user.fullName}'s deposit`,
        sourceTransaction: deposit._id,
        sourceModel: 'Deposit'
      });

      await commission.save();

      // Update user balance and commission total
      await User.findByIdAndUpdate(currentUser._id, {
        $inc: {
          balance: commissionAmount,
          totalCommissions: commissionAmount
        }
      });

      // Send notification
      if (currentUser.telegramChatId) {
        await telegramService.sendMessage(
          currentUser.telegramChatId,
          `💰 Commission earned!\n` +
          `Amount: ${commissionAmount.toLocaleString()} ETB\n` +
          `Level: ${level}\n` +
          `From: ${user.fullName}'s deposit`
        );
      }

      // Move to next level
      const nextUser = await User.findById(currentUser._id).populate('referredBy');
      currentUser = nextUser?.referredBy;
      level++;
    }
  } catch (error) {
    console.error('Commission processing error:', error);
  }
}

module.exports = router;