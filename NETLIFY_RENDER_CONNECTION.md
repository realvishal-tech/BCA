# 🔥 Netlify ↔ Render Connection - Quick Reference

## 📊 Architecture

```
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  NETLIFY         │      │  RENDER          │      │  MONGODB ATLAS   │
│  (Frontend)      │─────→│  (Backend)       │─────→│  (Database)      │
│                  │      │                  │      │                  │
│ - HTML/CSS/JS    │      │ - Node.js/Exp.   │      │ - User Data      │
│ - Forms & UI     │ Fetch │ - Auth APIs      │ Query │ - Activities     │
│ - Public Folder  │      │ - server.js      │      │ - Cloud Storage  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
  URL:                      URL:                      Connection String:
  netlify.app               onrender.com              MONGODB_URI
```

---

## 🛠️ How It Works (Step-by-Step)

### 1️⃣ User Fills Form (on Netlify)
```
User enters email & password in form
                ↓
JavaScript button click handler
```

### 2️⃣ Frontend Sends Request (Using Fetch API)
```
fetch("https://bca-student-portal.onrender.com/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
})
```

### 3️⃣ Request Travels Over Internet
```
Netlify Frontend (Your User)
       ↓ (HTTPS)
   Internet
       ↓ (HTTPS)
Render Backend (Our Server)
```

### 4️⃣ Backend Processes Request
```
Express receives POST /api/login
       ↓
Validates email & password
       ↓
Queries MongoDB for user
       ↓
Compares password hash
       ↓
Returns JWT token (if valid)
```

### 5️⃣ Response Comes Back (HTTPS)
```
Backend sends:
{
  message: "Login successful",
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: { email, firstName, ... }
}
```

### 6️⃣ Frontend Receives & Stores Response
```
JavaScript receives response
       ↓
Stores token in localStorage
       ↓
Redirects to dashboard.html
```

---

## 📁 File Structure

```
/workspaces/BCA/
├── public/                          # Netlify deploys this folder
│   ├── index.html                   # Login page
│   ├── register.html                # Registration page
│   ├── dashboard.html               # User dashboard
│   ├── admin.html                   # Admin login
│   ├── admin-dashboard.html         # Admin dashboard
│   ├── style.css                    # Styling
│   ├── script.js                    # Main JavaScript logic ⭐
│   ├── config.js                    # API URL configuration ⭐
│   └── script.js                    # Uses config.js ⭐
├── server/                          # Render deploys this folder
│   ├── server.js                    # Express backend ⭐
│   ├── package.json                 # Dependencies
│   └── .env                         # Environment variables (MongoDB, JWT)
├── netlify.toml                     # Netlify settings ⭐
├── render.yaml                      # Render settings ⭐
└── Procfile                         # Render process file ⭐
```

---

## 🔑 Key Files & Their Roles

### Frontend (Netlify)
```
config.js       → Detects environment & sets API_BASE URL
script.js       → Handles login/register, makes API calls
HTML files      → User interface forms
```

### Backend (Render)
```
server.js       → Express routes & API endpoints
                  - /api/login
                  - /api/register
                  - /api/profile
                  - /api/logout
package.json    → Dependencies (express, mongoose, jwt, etc.)
.env            → Secrets (MONGODB_URI, JWT_SECRET, etc.)
```

---

## 🌐 API Endpoints Reference

Your frontend calls these endpoints on the backend:

```
POST   /api/register          # Create new user account
POST   /api/login             # Login & get JWT token
POST   /api/admin-login       # Admin login
GET    /api/profile           # Get logged-in user's profile
POST   /api/logout            # Log activity
```

**Example API Call from Frontend:**
```javascript
// In script.js
const response = await fetch(`${API_BASE}/api/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});
```

**Where `API_BASE` is:**
- Local: `http://localhost:5000`
- Netlify: `https://bca-student-portal.onrender.com`

---

## 🔐 Security Flow

```
User Password
     ↓
Backend receives (HTTPS)
     ↓
Hashes with bcryptjs
     ↓
Compares with stored hash in MongoDB
     ↓
If match: Generate JWT token
     ↓
Frontend receives token
     ↓
Stores in localStorage
     ↓
Sends JWT in every API call for authentication
```

---

## 🚀 Deployment Checklist

### Before Deploying to Netlify

- ✅ Push all changes to GitHub
- ✅ `config.js` is in `public/` folder
- ✅ All HTML files include `<script src="config.js"></script>`
- ✅ `netlify.toml` exists in root
- ✅ Script correctly detects API_BASE

### Before Netlify Deployment Works

- ✅ Render backend is **LIVE** (green status)
- ✅ MongoDB connection string is set in Render
- ✅ CORS is enabled in `server.js`: `app.use(cors())`
- ✅ Test backend locally works: `npm start` in server folder

### After Netlify Deployment

- ✅ Visit netlify.app URL
- ✅ Open DevTools → Network tab
- ✅ Register an account
- ✅ Should see POST request to `onrender.com`
- ✅ Data should save to MongoDB

---

## 🔧 Quick Troubleshooting

### Problem: CORS Error
**Solution:** Ensure `app.use(cors());` is in server.js (line ~11)

### Problem: API URL Wrong
**Solution:** Update `CONFIG.PRODUCTION.API_BASE` in config.js

### Problem: MongoDB Connection Failed
**Solution:** Check MONGODB_URI in Render environment variables

### Problem: Can't Connect to Backend
**Solution:** 
1. Visit Render dashboard
2. Check if service is **"Live"**
3. Check logs at bottom for errors

---

## 📞 Support Contact

- **Frontend Issues:** Check Netlify logs
- **Backend Issues:** Check Render logs
- **Database Issues:** Check MongoDB Atlas connection

---

## ✨ Success Means

✅ User registers on Netlify  
✅ Data travels to Render  
✅ Data saves to MongoDB  
✅ User can login with new account  
✅ Dashboard shows user profile  

🎉 **If all above work → You're connected!**
