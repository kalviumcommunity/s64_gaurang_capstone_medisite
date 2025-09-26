# MediVerse Deployment Guide

## Current Issue: "Failed to fetch" Error

The error occurs because your frontend (deployed on Netlify) is trying to connect to `http://localhost:5001`, which only works locally.

## Solutions:

### Option 1: Deploy Backend to Cloud Service (Recommended)

#### A. Deploy to Railway (Easiest)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Create new project from GitHub repo
4. Select your backend folder
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `DEEP_SEEK_API_KEY`: Your DeepSeek API key
6. Deploy and get your backend URL

#### B. Deploy to Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables (same as above)

#### C. Deploy to Heroku
1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Add MongoDB Atlas addon
4. Set environment variables
5. Deploy: `git push heroku main`

### Option 2: Use MongoDB Atlas (Cloud Database)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in your backend environment

### Option 3: Quick Fix for Testing

Update your frontend environment to use a temporary backend URL:

```bash
# In frontend/.env
VITE_BACKEND_URL=https://your-deployed-backend-url.com
```

## Steps to Fix:

1. **Deploy your backend** to any cloud service (Railway recommended)
2. **Get your backend URL** from the deployment
3. **Update frontend/.env** with the new backend URL
4. **Redeploy frontend** to Netlify
5. **Update CORS** in backend/server.js with your Netlify URL

## Environment Variables Needed:

### Backend (.env):
```
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mediverse
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
DEEP_SEEK_API_KEY=your_deepseek_api_key
```

### Frontend (.env):
```
VITE_BACKEND_URL=https://your-backend-url.railway.app
```

## Testing Locally:

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm run dev`
3. Test registration/login

## Production Checklist:

- [ ] Backend deployed to cloud service
- [ ] MongoDB Atlas configured
- [ ] Environment variables set
- [ ] CORS configured for Netlify URL
- [ ] Frontend environment updated
- [ ] Test registration/login on production
