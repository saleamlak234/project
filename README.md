# Saham Trading Platform

A comprehensive MLM investment platform built with React, Node.js, and MongoDB.

## Features

- **Investment Packages**: Multiple investment tiers with 15% daily returns
- **MLM System**: 4-level commission structure (8%, 4%, 2%, 1%)
- **Admin Panel**: Complete admin dashboard for managing users and transactions
- **Secure Authentication**: JWT-base d authentication with role-based access
- **File Upload**: Cloudinary integration for receipt uploads
- **Email System**: Gmail integration for password reset
- **Responsive Design**: Mobile-first responsive design

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js with Express
-  MongoDB with Mongoose
- JWT for authentication
- Cloudinary for file storage
- Nodemailer with Gmail for emails
- bcryptjs for password hashing

## Installation

### Prerequisites
- Node.js 18+ 
- MongoDB
- Gmail account with App Password
- Cloudinary account

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd saham-trading-platform
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. **Environment Configuration**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
```

Required environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/saham-trading
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:5173
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=3000
```

4. **Database Setup**
```bash
# Seed the database with initial data
cd server
npm run seed
```

5. **Start Development**
```bash
# Start backend server
cd server
npm run dev

# Start frontend (in new terminal)
npm run dev
```

## Default Login Credentials

After seeding the database:

**Super Admin:**
- Email: `superadmin@sahamtrading.com`
- Password: `superadmin123`

**Sample User:**
- Email: `john@example.com`
- Password: `password123`

## Gmail Setup for Password Reset

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `GMAIL_APP_PASSWORD`

## Cloudinary Setup

1. Create account at cloudinary.com
2. Get your cloud name, API key, and API secret from dashboard
3. Add to environment variables

## Project Structure

```
├── src/                    # Frontend React application
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   └── main.tsx           # App entry point
├── server/                # Backend Node.js application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── config/            # Configuration files
│   └── index.js           # Server entry point
└── README.md
```

## API Endpoints

### Authentication
-  `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/transactions` - Get all transactions
- `PUT /api/admin/transactions/:id` - Update transaction status

### User Operations
- `GET /api/deposits` - Get user deposits
- `POST /api/deposits` - Create new deposit
- `GET /api/withdrawals` - Get user withdrawals
- `POST /api/withdrawals` - Create withdrawal request

## Deployment

### cPanel Deployment

1. **Build the application**
```bash
npm run build
```

2. **Upload files**
   - Upload `dist/` folder contents to public_html
   - Upload `server/` folder to your hosting directory
   - Upload `package.json` to root

3. **Install dependencies on server**
```bash
npm install --production
```

4. **Configure environment variables**
   - Create `.env` file with production values
   - Update `FRONTEND_URL` to your domain

5. **Start the application**
```bash
npm start
```

## Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Secure file upload with Cloudinary

## License

MIT License - see LICENSE file for details