const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
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
const cloudinaryRoutes = require('./routes/cloudinary');

// Import middleware
const authMiddleware = require('./middleware/auth');
const adminMiddleware = require('./middleware/admin');
const adminAuthMiddleware = require('./middleware/adminAuth');

// Load environment variables
dotenv.config();

const app = express();

// CORS Configuration with credentials
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Define allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL,
      // Add your production domain here
      'https://your-production-domain.com'
    ].filter(Boolean); // Remove undefined values
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'X-CSRF-Token'
  ],
  exposedHeaders: [
    'Content-Length',
    'X-Foo',
    'X-Bar'
  ],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  preflightContinue: false
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist (for backward compatibility)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files with proper headers (for backward compatibility)
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
app.use('/api/cloudinary', cloudinaryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      message: 'CORS policy violation: Origin not allowed',
      error: 'CORS_ERROR'
    });
  }
  
  // Handle Cloudinary errors
  if (err.message && err.message.includes('cloudinary')) {
    return res.status(400).json({ message: 'File upload error: ' + err.message });
  }
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
  }
  
  if (err.message === 'Only image and PDF files are allowed') {
    return res.status(400).json({ message: err.message });
  }
  
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS enabled with credentials support');
  console.log('Cloudinary integration enabled for file uploads');
});

module.exports = app;