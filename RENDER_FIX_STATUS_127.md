# Render Deployment - Status 127 Fix

## Problem
Getting "Exited with status 127" error on Render deployment.

## Solution

### Step 1: Redeploy with Updated Configuration

We've updated your deployment files. To deploy:

1. **Commit and push changes:**
```bash
cd /workspaces/BCA
git add .
git commit -m "Fix: Update Procfile and render.yaml for Render deployment"
git push origin main
```

2. **In Render Dashboard:**
   - Go to your service settings
   - Click **Environment** and add these variables:
   ```
   MONGODB_URI=mongodb+srv://bcaadmin:YOUR_PASSWORD@cluster0.12345.mongodb.net/bca-student-portal?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_production_2024
   PORT=5000
   ADMIN_EMAIL=your@gmail.com
   ADMIN_PASSWORD=YourPassword123
   NODE_ENV=production
   ```

3. **Important - Leave Root Directory BLANK** (don't set it to 'server')
   - The render.yaml handles the directory navigation

4. **Click Deploy** - Render will auto-redeploy

### Step 2: Verify

Once deployment completes (status = **Live**):
- Visit your Render URL
- Test registration and login
- Check logs if there are any errors

### What Was Fixed

1. **Procfile**: Simplified to `npm start` (handles directory change via root package.json)
2. **render.yaml**: Added explicit build and start commands
3. **.env.example**: Updated in server directory

These changes ensure Node finds all required commands and executes in the correct directory.

### If Still Having Issues

Check Render logs for:
- **MongoDB connection errors**: Verify MONGODB_URI is correct
- **Missing dependencies**: npm install should run automatically
- **Port issues**: Ensure PORT is set to 5000

### Quick Commands

```bash
# Test locally before deploying
cd server
npm install
npm start
# Should print "✅ Server running on port 5000"
```
