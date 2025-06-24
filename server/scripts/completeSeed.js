const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AdminRole = require('../models/AdminRole');
const MerchantAccount = require('../models/MerchantAccount');
const QRCode = require('qrcode');
require('dotenv').config();

async function completeSeed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saham-trading');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await AdminRole.deleteMany({});
    await MerchantAccount.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create Super Admin
    const superAdminPassword = await bcrypt.hash('superadmin123', 10);
    const superAdmin = new User({
      fullName: 'Super Administrator',
      email: 'superadmin@sahamtrading.com',
      phoneNumber: '+251911000001',
      password: superAdminPassword,
      role: 'admin',
      referralCode: 'SUPERADMIN',
      isActive: true,
      balance: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalCommissions: 0,
      level: 1,
      directReferrals: 0,
      totalTeamSize: 0
    });
    await superAdmin.save();

    // Create Super Admin Role
    const superAdminRole = new AdminRole({
      user: superAdmin._id,
      role: 'super_admin',
      permissions: [
        'view_users', 'edit_users', 'delete_users',
        'view_transactions', 'process_transactions',
        'view_reports', 'manage_merchants', 'system_settings'
      ],
      isActive: true
    });
    await superAdminRole.save();

    // Create View Admin 1
    const viewAdmin1Password = await bcrypt.hash('viewadmin1', 10);
    const viewAdmin1 = new User({
      fullName: 'View Administrator 1',
      email: 'viewadmin1@sahamtrading.com',
      phoneNumber: '+251911000002',
      password: viewAdmin1Password,
      role: 'admin',
      referralCode: 'VIEWADMIN1',
      isActive: true,
      balance: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalCommissions: 0,
      level: 1,
      directReferrals: 0,
      totalTeamSize: 0
    });
    await viewAdmin1.save();

    // Create View Admin 1 Role
    const viewAdmin1Role = new AdminRole({
      user: viewAdmin1._id,
      role: 'view_admin_1',
      permissions: ['view_users', 'view_transactions', 'view_reports'],
      isActive: true
    });
    await viewAdmin1Role.save();

    // Create View Admin 2
    const viewAdmin2Password = await bcrypt.hash('viewadmin2', 10);
    const viewAdmin2 = new User({
      fullName: 'View Administrator 2',
      email: 'viewadmin2@sahamtrading.com',
      phoneNumber: '+251911000003',
      password: viewAdmin2Password,
      role: 'admin',
      referralCode: 'VIEWADMIN2',
      isActive: true,
      balance: 0,
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalCommissions: 0,
      level: 1,
      directReferrals: 0,
      totalTeamSize: 0
    });
    await viewAdmin2.save();

    // Create View Admin 2 Role
    const viewAdmin2Role = new AdminRole({
      user: viewAdmin2._id,
      role: 'view_admin_2',
      permissions: ['view_users', 'view_transactions', 'view_reports'],
      isActive: true
    });
    await viewAdmin2Role.save();

    // Create Sample Regular Users
    const sampleUsers = [
      {
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+251911111111',
        password: 'password123',
        referralCode: 'JOHN001'
      },
      {
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        phoneNumber: '+251911111112',
        password: 'password123',
        referralCode: 'JANE001'
      },
      {
        fullName: 'Bob Johnson',
        email: 'bob@example.com',
        phoneNumber: '+251911111113',
        password: 'password123',
        referralCode: 'BOB001'
      }
    ];

    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
        role: 'user',
        isActive: true,
        balance: Math.floor(Math.random() * 50000),
        totalDeposits: Math.floor(Math.random() * 100000),
        totalWithdrawals: Math.floor(Math.random() * 20000),
        totalCommissions: Math.floor(Math.random() * 15000),
        level: Math.floor(Math.random() * 4) + 1,
        directReferrals: Math.floor(Math.random() * 10),
        totalTeamSize: Math.floor(Math.random() * 50)
      });
      await user.save();
      console.log(`👤 Sample user created: ${user.email}`);
    }

    // Create Merchant Accounts with QR Codes
    const merchants = [
      {
        bankName: 'Commercial Bank of Ethiopia (CBE)',
        accountNumber: '1000634860001',
        accountHolder: 'Saham Trading Primary',
        branch: 'Addis Ababa Main Branch',
        description: 'Primary merchant account for deposits'
      },
      {
        bankName: 'Commercial Bank of Ethiopia (CBE)',
        accountNumber: '1000634860002',
        accountHolder: 'Saham Trading Secondary',
        branch: 'Bole Branch',
        description: 'Secondary merchant account for high volume'
      },
      {
        bankName: 'Dashen Bank',
        accountNumber: '0123456789012',
        accountHolder: 'Saham Trading Dashen',
        branch: 'Merkato Branch',
        description: 'Alternative banking option'
      },
      {
        bankName: 'Bank of Abyssinia',
        accountNumber: '9876543210987',
        accountHolder: 'Saham Trading BOA',
        branch: 'Piassa Branch',
        description: 'Additional merchant account'
      }
    ];

    for (const merchantData of merchants) {
      // Generate QR Code
      const qrData = {
        bankName: merchantData.bankName,
        accountNumber: merchantData.accountNumber,
        accountHolder: merchantData.accountHolder,
        branch: merchantData.branch
      };
      
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData));
      
      const merchant = new MerchantAccount({
        ...merchantData,
        qrCode: qrCodeDataURL,
        isActive: true,
        dailyLimit: 1000000, // 1M ETB daily limit
        currentDailyAmount: 0
      });

      await merchant.save();
      console.log(`🏦 Merchant account created: ${merchant.bankName} - ${merchant.accountNumber}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 ADMIN LOGIN CREDENTIALS:');
    console.log('================================');
    console.log('🔑 SUPER ADMIN:');
    console.log('   Email: superadmin@sahamtrading.com');
    console.log('   Password: superadmin123');
    console.log('   Permissions: Full system access');
    console.log('');
    console.log('👁️ VIEW ADMIN 1:');
    console.log('   Email: viewadmin1@sahamtrading.com');
    console.log('   Password: viewadmin1');
    console.log('   Permissions: View only access');
    console.log('');
    console.log('👁️ VIEW ADMIN 2:');
    console.log('   Email: viewadmin2@sahamtrading.com');
    console.log('   Password: viewadmin2');
    console.log('   Permissions: View only access');
    console.log('');
    console.log('👤 SAMPLE USER:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');
    console.log('================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

completeSeed();