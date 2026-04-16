# 🚀 Render.com Deployment - Quick Setup Guide

## 📦 Package.json Configuration

Your application is now configured for optimal Render deployment with:

### Root-level Configuration
- **package.json** - Main entry point, handles server directory navigation
- **Procfile** - Tells Render how to start your app (`web: cd server && npm install && npm start`)
- **.nvmrc** - Specifies Node.js version (18.18.0)

### Server-level Configuration  
- **server/package.json** - Contains all production dependencies
- **server/Procfile** - Backup Procfile with startup command

### Supported Node Versions
- **Specified:** Node.js 18.x with npm 9.x
- **Recommended:** Use latest LTS (18.18.0+)

---

## 🔧 Environment Variables for Render

Add these to your Render dashboard under **Environment**:

```env
MONGODB_URI=mongodb+srv://bcaadmin:<password>@cluster0.xxxxx.mongodb.net/bca-student-portal?retryWrites=true&w=majority
JWT_SECRET=your_very_long_random_secret_key_here_minimum_32_characters
PORT=3000
ADMIN_EMAIL=admin@bca.com
ADMIN_PASSWORD=SecurePassword123
NODE_ENV=production
```

**Important:** Replace with actual values!

---

## 📋 Step-by-Step Render Deployment

### Step 1: Prepare GitHub
```bash
# Push your code to GitHub
git add .
git commit -m "Optimize for Render deployment"
git push origin main
```

### Step 2: Create Render Service
1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository containing this code

### Step 3: Configure Render Service
- **Name:** `bca-student-portal` (or your choice)
- **Environment:** `Node`
- **Build Command:** Leave empty (default)
- **Start Command:** Leave empty (Render will read Procfile)
- **Node Version:** Will auto-detect from .nvmrc (18.18.0)

### Step 4: Set Environment Variables
In Render Dashboard:
1. Go to **"Environment"** tab
2. Add all variables from the list above
3. Click **"Save"**

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Render automatically starts deployment
3. Wait for build to complete (~2-3 minutes)
4. Check logs for errors

### Step 6: Verify Deployment
- ✅ Check deployment URL
- ✅ Test login at `/index.html`
- ✅ Check MongoDB connection in logs

---

## 🔍 Monitoring & Troubleshooting

### View Logs
```
Render Dashboard → Your Service → Logs
```

### Common Issues

**Error: "Cannot find module"**
- Solution: Ensure all dependencies are in `server/package.json`
- Render runs: `cd server && npm install`

**Error: "MongoDB connection failed"**
- Check `MONGODB_URI` is correct
- Verify IP whitelist includes `0.0.0.0/0` in MongoDB Atlas
- Ensure MongoDB Atlas cluster is running

**Port Issues**
- Render assigns port dynamically
- App reads `process.env.PORT` correctly ✓

**Build Takes Too Long**
- Check `server/node_modules` is in `.gitignore`
- Render will reinstall dependencies fresh

---

## 📊 Performance Tips

1. **Deploy on Free Tier First**
   - Test functionality before upgrading
   - Upgrade to Paid when ready for production

2. **Monitor Usage**
   - Render Dashboard → Metrics
   - Watch memory and CPU usage

3. **Enable Auto-Deploy**
   - Render → Settings → Auto-Deploy
   - Redeploy on every push to main

4. **Use Render's Native Support**
   - ✅ MongoDB Atlas (free tier)
   - ✅ Node.js auto-detection
   - ✅ Zero-config SSL/HTTPS

---

## ✅ Deployment Checklist

- [ ] GitHub repo created and code pushed
- [ ] MongoDB Atlas cluster running with connection string
- [ ] Render account created
- [ ] Service created and connected to GitHub
- [ ] Environment variables added to Render
- [ ] Build completed successfully
- [ ] Logs show "Server running on port 3000" (or assigned port)
- [ ] Website loads at deployment URL
- [ ] Login functionality works
- [ ] Can create new accounts

---

## 🆘 Need Help?

**Check These Files:**
- `DEPLOY_RENDER.md` - Full deployment guide
- `server/.env.example` - Environment variable templates
- `server/Procfile` - Startup configuration
- `package.json` - Entry point configuration

**Render Support:** [dashboard.render.com/help](https://dashboard.render.com/help)

---

**Last Updated:** April 2026
**Status:** ✅ Production Ready for Render Deployment
