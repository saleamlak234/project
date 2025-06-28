const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const depositRoutes = require('./routes/deposits');
const enhancedDepositRoutes = require('./routes/enhancedDeposits');
const withdrawalRoutes = require('./routes/withdrawals');
const withdrawalScheduleRoutes = require('./routes/withdrawalSchedule');
const commissionRoutes = require('./routes/commissions');
const mlmRoutes = require('./routes/mlm');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const adminAuthRoutes = require('./routes/adminAuth');
const chapaRoutes = require('./routes/chapa');
const merchantRoutes = require('./routes/merchants');
const transactionRoutes = require('./routes/transactions');
const fileRoutes = require('./routes/files');

// Import middleware
const authMiddleware = require('./middleware/auth');
const adminMiddleware = require('./middleware/admin');
const adminAuthMiddleware = require('./middleware/adminAuth');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files with proper headers
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, path) => {
    // Set cache headers for better performance
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    
    // Set proper content types
    const ext = path.split('.').pop().toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        res.setHeader('Content-Type', 'image/jpeg');
        break;
      case 'png':
        res.setHeader('Content-Type', 'image/png');
        break;
      case 'gif':
        res.setHeader('Content-Type', 'image/gif');
        break;
      case 'pdf':
        res.setHeader('Content-Type', 'application/pdf');
        break;
      case 'webp':
        res.setHeader('Content-Type', 'image/webp');
        break;
    }
  }
}));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/saham-trading', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin-auth', adminAuthRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/deposits', authMiddleware, depositRoutes);
app.use('/api/enhanced-deposits', authMiddleware, enhancedDepositRoutes);
app.use('/api/withdrawals', authMiddleware, withdrawalRoutes);
app.use('/api/withdrawal-schedule', authMiddleware, withdrawalScheduleRoutes);
app.use('/api/commissions', authMiddleware, commissionRoutes);
app.use('/api/mlm', authMiddleware, mlmRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/admin', authMiddleware, adminAuthMiddleware(['view_users', 'view_transactions']), adminRoutes);
app.use('/api/chapa', chapaRoutes);
app.use('/api/merchants', authMiddleware, merchantRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);
app.use('/api/files', fileRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;