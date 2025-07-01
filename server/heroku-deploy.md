# Deploying Saham Trading Backend to Heroku

## Prerequisites
1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Create a Heroku account: https://signup.heroku.com/
3. Have a MongoDB Atlas account for the database

## Step-by-Step Deployment

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create a new Heroku app
```bash
cd server
heroku create saham-trading-backend
```

### 3. Set up MongoDB Atlas
1. Go to https://cloud.mongodb.com/
2. Create a new cluster (free tier available)
3. Create a database user
4. Get your connection string
5. Whitelist Heroku IPs (0.0.0.0/0 for all IPs)

### 4. Set environment variables
```bash
# Required variables
heroku config:set MONGODB_URI="your-mongodb-atlas-connection-string"
heroku config:set JWT_SECRET="your-jwt-secret-key"
heroku config:set FRONTEND_URL="https://glistening-blini-b81e99.netlify.app"
heroku config:set NODE_ENV="production"

# Email configuration (required for password reset)
heroku config:set EMAIL_USER="your-gmail@gmail.com"
heroku config:set EMAIL_PASS="your-gmail-app-password"

# Optional: Payment gateway
heroku config:set CHAPA_SECRET_KEY="your-chapa-secret"
heroku config:set CHAPA_PUBLIC_KEY="your-chapa-public-key"

# Optional: Telegram notifications
heroku config:set TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
heroku config:set TELEGRAM_ADMIN_CHAT_ID="your-admin-chat-id"

# Optional: File uploads (Cloudinary)
heroku config:set CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
heroku config:set CLOUDINARY_API_KEY="your-cloudinary-key"
heroku config:set CLOUDINARY_API_SECRET="your-cloudinary-secret"
```

### 5. Deploy to Heroku
```bash
# Initialize git repository if not already done
git init
git add .
git commit -m "Initial commit"

# Add Heroku remote
heroku git:remote -a saham-trading-backend

# Deploy
git push heroku main
```

### 6. Seed the database (optional)
```bash
heroku run npm run seed
```

### 7. Check logs
```bash
heroku logs --tail
```

## Important Notes

### CORS Configuration
The backend is already configured to accept requests from your Netlify frontend URL. If you change the frontend URL, update the FRONTEND_URL environment variable.

### Database Seeding
After deployment, you can seed the database with initial admin accounts:
```bash
heroku run node scripts/completeSeed.js
```

This will create:
- Super Admin: superadmin@sahamtrading.com / superadmin123
- View Admin 1: viewadmin1@sahamtrading.com / viewadmin1
- View Admin 2: viewadmin2@sahamtrading.com / viewadmin2

### File Uploads
If you're using file uploads, make sure to configure Cloudinary environment variables. Without Cloudinary, file uploads will fail.

### Monitoring
- View app: `heroku open`
- View logs: `heroku logs --tail`
- Check dyno status: `heroku ps`

## Troubleshooting

### Common Issues
1. **App crashes on startup**: Check logs with `heroku logs --tail`
2. **Database connection fails**: Verify MONGODB_URI is correct
3. **CORS errors**: Ensure FRONTEND_URL matches your Netlify URL
4. **File upload errors**: Configure Cloudinary variables

### Health Check
Your backend will be available at: `https://your-app-name.herokuapp.com/api/health`

## Updating Frontend Configuration
After deploying the backend, update your frontend's API URL:

1. In your Netlify dashboard, go to Site settings > Environment variables
2. Add: `VITE_API_URL` = `https://your-heroku-app.herokuapp.com/api`
3. Redeploy your frontend

## Cost Considerations
- Heroku free tier has limitations (app sleeps after 30 minutes of inactivity)
- Consider upgrading to Hobby dyno ($7/month) for production use
- MongoDB Atlas free tier (512MB) should be sufficient for initial testing

## Security Recommendations
1. Use strong JWT secrets
2. Enable MongoDB Atlas IP whitelisting
3. Use environment variables for all sensitive data
4. Enable HTTPS only (Heroku provides this by default)
5. Regularly rotate API keys and passwords