# Update Frontend Configuration for Production

After deploying your backend to Heroku, you need to update your frontend configuration to point to the production API.

## Steps:

### 1. Update Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Navigate to your site (glistening-blini-b81e99.netlify.app)
3. Go to **Site settings** > **Environment variables**
4. Add the following variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-heroku-app-name.herokuapp.com/api`

### 2. Redeploy Frontend

After adding the environment variable, trigger a new deployment:
1. In Netlify dashboard, go to **Deploys**
2. Click **Trigger deploy** > **Deploy site**

### 3. Test the Connection

Once both frontend and backend are deployed:
1. Visit your frontend: https://glistening-blini-b81e99.netlify.app
2. Try to register/login to test the API connection
3. Check browser console for any CORS or connection errors

## Important Notes:

- Make sure your Heroku backend URL is correct
- The backend should be accessible at: `https://your-app-name.herokuapp.com/api/health`
- CORS is already configured to accept requests from your Netlify URL
- If you encounter issues, check both Netlify and Heroku logs

## Verification:

Your full-stack application should now be live with:
- **Frontend**: https://glistening-blini-b81e99.netlify.app
- **Backend**: https://your-heroku-app-name.herokuapp.com