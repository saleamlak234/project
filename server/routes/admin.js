const express = require('express');
const User = require('../models/User');
const Deposit = require('../models/Deposit');
const Withdrawal = require('../models/Withdrawal');
const Commission = require('../models/Commission');
const telegramService = require('../services/telegram');

const router = express.Router();

// Get admin dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Financial statistics
    const totalDepositsResult = await Deposit.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalWithdrawalsResult = await Withdrawal.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalCommissionsResult = await Commission.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Pending transactions
    const pendingDeposits = await Deposit.countDocuments({ status: 'pending' });
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });

    // Monthly revenue (current month)
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const monthlyRevenueResult = await Deposit.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lt: new Date(currentYear, currentMonth, 1)
          }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Recent transactions
    const recentTransactions = await Deposit.find()
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentWithdrawals = await Withdrawal.find()
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Combine transactions
    const allRecentTransactions = [
      ...recentTransactions.map(t => ({
        id: t._id,
        type: 'deposit',
        amount: t.amount,
        status: t.status,
        user: t.user,
        createdAt: t.createdAt
      })),
      ...recentWithdrawals.map(t => ({
        id: t._id,
        type: 'withdrawal',
        amount: t.amount,
        status: t.status,
        user: t.user,
        createdAt: t.createdAt
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

    // Recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      activeUsers,
      totalDeposits: totalDepositsResult[0]?.total || 0,
      totalWithdrawals: totalWithdrawalsResult[0]?.total || 0,
      totalCommissions: totalCommissionsResult[0]?.total || 0,
      pendingDeposits,
      pendingWithdrawals,
      monthlyRevenue: monthlyRevenueResult[0]?.total || 0,
      recentTransactions: allRecentTransactions,
      recentUsers
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error fetching admin statistics' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// Update user status
router.put('/users/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send notification to user
    if (user.telegramChatId) {
      const message = isActive 
        ? '✅ Your account has been activated!'
        : '❌ Your account has been deactivated. Please contact support.';
      
      await telegramService.sendMessage(user.telegramChatId, message);
    }

    res.json({ message: 'User status updated successfully', user });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error updating user status' });
  }
});

// Get all transactions
router.get('/transactions', async (req, res) => {
  try {
    const deposits = await Deposit.find()
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 });

    const withdrawals = await Withdrawal.find()
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 });

    // Combine and format transactions
    const transactions = [
      ...deposits.map(d => ({
        id: d._id,
        type: 'deposit',
        amount: d.amount,
        status: d.status,
        paymentMethod: d.paymentMethod,
        user: d.user,
        receiptUrl: d.receiptUrl,
        rejectionReason: d.rejectionReason,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt
      })),
      ...withdrawals.map(w => ({
        id: w._id,
        type: 'withdrawal',
        amount: w.amount,
        status: w.status,
        paymentMethod: w.paymentMethod,
        user: w.user,
        accountDetails: w.accountDetails,
        rejectionReason: w.rejectionReason,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error fetching transactions' });
  }
});

// Update transaction status
router.put('/transactions/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { action, rejectionReason } = req.body;

    // Find transaction in deposits or withdrawals
    let transaction = await Deposit.findById(transactionId).populate('user');
    let isDeposit = true;

    if (!transaction) {
      transaction = await Withdrawal.findById(transactionId).populate('user');
      isDeposit = false;
    }

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction is not pending' });
    }

    // Update transaction status
    const newStatus = action === 'approve' ? 'completed' : 'rejected';
    transaction.status = newStatus;
    transaction.processedBy = req.user._id;
    transaction.processedAt = new Date();

    if (action === 'reject' && rejectionReason) {
      transaction.rejectionReason = rejectionReason;
    }

    await transaction.save();

    if (isDeposit && action === 'approve') {
      // Process deposit approval
      await processDepositApproval(transaction);
    } else if (!isDeposit) {
      // Process withdrawal
      await processWithdrawal(transaction, action);
    }

    // Send notification to user
    if (transaction.user.telegramChatId) {
      const message = isDeposit
        ? (action === 'approve' 
            ? `✅ Your deposit of ${transaction.amount.toLocaleString()} ETB has been approved!`
            : `❌ Your deposit has been rejected. Reason: ${rejectionReason || 'Not specified'}`)
        : (action === 'approve'
            ? `✅ Your withdrawal of ${transaction.amount.toLocaleString()} ETB has been processed!`
            : `❌ Your withdrawal has been rejected. Reason: ${rejectionReason || 'Not specified'}`);
      
      await telegramService.sendMessage(transaction.user.telegramChatId, message);
    }

    res.json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error updating transaction' });
  }
});

// Helper function to process deposit approval
async function processDepositApproval(deposit) {
  try {
    // Update user's total deposits
    await User.findByIdAndUpdate(deposit.user._id, {
      $inc: { totalDeposits: deposit.amount }
    });

    // Process commissions
    await processDepositCommissions(deposit);
  } catch (error) {
    console.error('Process deposit approval error:', error);
  }
}

// Helper function to process withdrawal
async function processWithdrawal(withdrawal, action) {
  try {
    if (action === 'approve') {
      // Update user's total withdrawals
      await User.findByIdAndUpdate(withdrawal.user._id, {
        $inc: { totalWithdrawals: withdrawal.amount }
      });
    } else {
      // Return amount to user balance if rejected
      await User.findByIdAndUpdate(withdrawal.user._id, {
        $inc: { balance: withdrawal.amount }
      });
    }
  } catch (error) {
    console.error('Process withdrawal error:', error);
  }
}

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