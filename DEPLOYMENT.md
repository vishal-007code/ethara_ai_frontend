# Deployment Guide

This guide will help you deploy HRMS Lite to production.

## Quick Deployment Checklist

### 1. Database Setup (MongoDB Atlas)
- [ ] Create MongoDB Atlas account (free tier available)
- [ ] Create a new cluster
- [ ] Create a database user
- [ ] Whitelist IP addresses (0.0.0.0/0 for all IPs)
- [ ] Get connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/hrms_lite`)

### 2. Backend Deployment (Render/Railway)

#### Option A: Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: hrms-lite-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
   - `PORT`: (auto-assigned, no need to set)
6. Deploy

#### Option B: Railway
1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
5. Railway auto-detects Node.js and deploys

### 3. Frontend Deployment (Vercel/Netlify)

#### Option A: Vercel
1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variable:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://hrms-lite-backend.onrender.com/api`)
6. Deploy

#### Option B: Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
5. Add Environment Variable:
   - `REACT_APP_API_URL`: Your backend URL
6. Deploy

### 4. Update Frontend API URL

After backend deployment, update the frontend environment variable:
- In Vercel/Netlify dashboard, go to Environment Variables
- Update `REACT_APP_API_URL` to your deployed backend URL
- Redeploy frontend if needed

## Testing Deployment

1. **Backend Health Check:**
   - Visit: `https://your-backend-url.com/api/health`
   - Should return: `{"status":"OK","message":"Server is running","database":"Connected"}`

2. **Frontend:**
   - Visit your frontend URL
   - Try adding an employee
   - Try marking attendance
   - Verify data persists (refresh page)

## Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Check MongoDB Atlas IP whitelist and connection string
- **Port Error**: Ensure `PORT` environment variable is set (Render/Railway auto-sets this)
- **Build Fails**: Check Node.js version compatibility

### Frontend Issues
- **API Calls Fail**: Verify `REACT_APP_API_URL` is set correctly
- **CORS Errors**: Ensure backend CORS is configured (already done in code)
- **404 on Refresh**: Configure redirect rules (Vercel/Netlify handle this automatically)

## Environment Variables Summary

### Backend
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hrms_lite
NODE_ENV=production
PORT=5000 (auto-set by platform)
```

### Frontend
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Production Checklist

- [ ] MongoDB Atlas database created and accessible
- [ ] Backend deployed and health check passes
- [ ] Frontend deployed with correct API URL
- [ ] Test employee creation
- [ ] Test attendance marking
- [ ] Test data persistence
- [ ] Verify error handling works
- [ ] Check mobile responsiveness

## Support

If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables are set correctly
3. Ensure MongoDB connection string is valid
4. Check browser console for frontend errors
5. Check backend logs for API errors
