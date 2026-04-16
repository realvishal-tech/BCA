# 🚀 BCA Student Portal - Setup Instructions

Complete step-by-step guide to run the BCA Student Portal on your machine.

---

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git** (optional, for version control)

---

## ✅ Step 1: Verify Prerequisites

### Check Node.js Installation
```bash
node --version
# Should show v14.0.0 or higher

npm --version
# Should show 6.0.0 or higher
```

### Check MongoDB
**Option A: Local MongoDB**
```bash
mongo --version
# Should show MongoDB installed
```

**Option B: MongoDB Atlas (Cloud)**
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create free cluster
- Note connection string

---

## 📥 Step 2: Download Project

If you haven't already, navigate to the project:
```bash
cd /workspaces/BCA
```

Or clone from GitHub:
```bash
git clone <repository-url>
cd BCA
```

---

## 🔧 Step 3: Setup Backend

### Navigate to Server Directory
```bash
cd server
```

### Install Dependencies
```bash
npm install
```

This will install:
- express (web framework)
- mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- dotenv (environment variables)
- cors (cross-origin support)

### Verify Installation
```bash
npm list
# Should show all dependencies installed
```

---

## 🔐 Step 4: Configure Environment

### Edit `.env` File

Open `server/.env` and verify/update these values:

```env
MONGODB_URI=mongodb://localhost:27017/bca-student-portal
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
PORT=5000
ADMIN_EMAIL=10717vishal@gmail.com
ADMIN_PASSWORD=Vishal@@2004
```

**Important Notes:**
- If using MongoDB Atlas, replace MONGODB_URI with your connection string
- Change JWT_SECRET to a random string for production
- Keep ADMIN credentials secure
- PORT 5000 must be available

### For MongoDB Atlas:
If using cloud MongoDB, update MONGODB_URI:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bca-student-portal?retryWrites=true&w=majority
```

---

## 🔌 Step 5: Start MongoDB

### Option A: Local MongoDB (Linux/Mac)
```bash
# Using Homebrew
brew services start mongodb-community

# Verify MongoDB is running
brew services list
```

### Option B: Local MongoDB (Windows)
```bash
# If installed as service, it starts automatically
# Or run manually:
mongod
```

### Option C: Docker (All Platforms)
```bash
# Run MongoDB in Docker
docker run -d --name mongodb -p 27017:27017 mongo

# Verify
docker ps
```

### Option D: MongoDB Atlas
- No local installation needed
- Just ensure your connection string is in `.env`

---

## 🚀 Step 6: Start Backend Server

From the `server` directory:
```bash
npm start
```

**Expected Output:**
```
✅ MongoDB connected successfully
🚀 BCA Student Portal running at http://localhost:5000
📝 Login: http://localhost:5000
📚 Register: http://localhost:5000/register
🔐 Admin: http://localhost:5000/admin
```

**If connection fails:** Make sure MongoDB is running (Step 5)

---

## 🌐 Step 7: Open in Browser

### Access the Application:
1. **Student Login**: http://localhost:5000
2. **Student Register**: http://localhost:5000/register
3. **Admin Login**: http://localhost:5000/admin

**Note:** The frontend files are automatically served from the `public/` folder

---

## 👤 Step 8: Test the Application

### Create Student Account
1. Go to: **http://localhost:5000/register**
2. Fill in:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@gmail.com` *(Must be Gmail)*
   - Password: `Password123` *(6+ chars, letter + number)*
   - Course: `BCA`
3. Click **Register**
4. Should show success message and redirect to login in 2 seconds

### Login as Student
1. Go to: **http://localhost:5000**
2. Enter:
   - Email: `john.doe@gmail.com`
   - Password: `Password123`
3. Click **Login**
4. Should see **Dashboard** with your profile

### View Dashboard
1. After login, you'll see:
   - Welcome message with your name
   - Your email
   - Your course (BCA)
   - Your registration date
2. A **Logout** button is available in navbar

### Logout
1. Click **Logout** button
2. Activity logged as LOGOUT
3. Redirected to login page

### Admin Login
1. Go to: **http://localhost:5000/admin**
2. Enter:
   - Email: `10717vishal@gmail.com`
   - Password: `Vishal@@2004`
3. Click **Admin Login**
4. See **Admin Dashboard**

### Admin Dashboard
1. **Users Tab**: See all registered students
   - Name, Email, Course, Registration Date
2. **Activity Logs Tab**: See all activities
   - Email, Action (LOGIN/LOGOUT/VIEW_PAGE), Page, Timestamp

---

## 📊 Troubleshooting

### Issue: "Cannot GET /"
**Cause:** Backend server not running
**Solution:**
```bash
cd server
npm start
```

### Issue: "MongoDB connection failed"
**Cause:** MongoDB not running
**Solution:**
```bash
# Start MongoDB
brew services start mongodb-community
# Or use Docker
docker run -d -p 27017:27017 mongo
```

### Issue: "Port 5000 already in use"
**Cause:** Another application using port 5000
**Solution:**
```bash
# Option 1: Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Option 2: Change PORT in .env
# Change: PORT=5000 → PORT=5001
```

### Issue: "Only Gmail allowed"
**Cause:** Using non-Gmail email for registration
**Solution:** Use valid Gmail address (e.g., yourname@gmail.com)

### Issue: "Password must include letter + number"
**Cause:** Password validation failed
**Solution:** Use password with minimum 6 characters, containing both letters and numbers (e.g., Password123)

### Issue: "Email already registered"
**Cause:** Email already exists in database
**Solution:** Use different email or login with registered email

### Issue: "Invalid admin credentials"
**Cause:** Wrong admin email or password
**Solution:** Use credentials from `.env` file (10717vishal@gmail.com / Vishal@@2004)

### Issue: CORS Error in Console
**Cause:** Frontend making requests to wrong backend URL
**Solution:** Verify backend is running on http://localhost:5000

---

## 📱 Test on Mobile

### Development Testing
```bash
# Get your machine IP
ipconfig getifaddr en0  # Mac
hostname -I             # Linux
ipconfig                # Windows (look for IPv4)

# Access from phone/tablet on same network
http://<YOUR_IP>:5000
```

---

## 🔄 Full Workflow Check

✅ **Register Page**
- [ ] Can access register page
- [ ] Form has all fields
- [ ] Gmail validation works
- [ ] Password validation works
- [ ] Can submit and redirect to login

✅ **Login Page**
- [ ] Can access login page
- [ ] Can login with registered account
- [ ] Error shows for unregistered email
- [ ] Error shows for wrong password
- [ ] JWT token stored in localStorage

✅ **Dashboard**
- [ ] Auto-redirects if no token
- [ ] Shows user profile data
- [ ] Shows correct name and email
- [ ] Logout button works
- [ ] Activity tracked when opening

✅ **Admin Panel**
- [ ] Can login with admin credentials
- [ ] Users table shows all registered users
- [ ] Activity logs show all activities
- [ ] Can switch between tabs
- [ ] Logout works

---

## 🎯 Development Tips

### Enable Developer Tools
In any browser:
- **Windows/Linux:** Press `F12` or `Ctrl+Shift+I`
- **Mac:** Press `Cmd+Option+I`

### Console Debugging
- Check browser console for errors
- Check server console for API errors
- Look at Network tab to see API calls

### Check Database
**MongoDB Compass** (GUI for MongoDB):
1. Download from [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to `mongodb://localhost:27017`
3. Browse BCA database
4. View Users and Activities collections

### API Testing
Use **Postman** or **Insomnia**:
```
POST http://localhost:5000/api/login
Body: {"email":"test@gmail.com","password":"password123"}
```

---

## 📦 Project File Structure

```
BCA/
├── README.md                      # Project documentation
├── SETUP_INSTRUCTIONS.md          # This file
├── .gitignore                     # Git ignore rules
│
├── server/
│   ├── server.js                  # Main Express app
│   ├── package.json               # Dependencies
│   ├── .env                       # Configuration
│   └── node_modules/              # Installed packages (auto-generated)
│
└── public/
    ├── index.html                 # Login page
    ├── register.html              # Registration page
    ├── dashboard.html             # Student dashboard
    ├── admin.html                 # Admin login
    ├── admin-dashboard.html       # Admin panel
    ├── style.css                  # All styles
    └── script.js                  # All JavaScript
```

---

## 🚀 Next Steps

### For Learning
1. Modify CSS to customize colors
2. Add new fields to register form
3. Create new admin reports
4. Add email verification
5. Implement password reset

### For Production
1. Get SSL certificate (HTTPS)
2. Use strong JWT_SECRET
3. Deploy to cloud (Render, Railway, Heroku)
4. Set up continuous integration
5. Monitor application with APM tools
6. Use MongoDB Atlas for production

### For Enhancement
1. Add user profile picture
2. Implement notifications
3. Create course materials section
4. Add attendance tracking
5. Implement gradebook
6. Add messaging system

---

## 📞 Support Resources

- **Express.js:** https://expressjs.com/
- **MongoDB:** https://docs.mongodb.com/
- **JWT:** https://jwt.io/
- **Mongoose:** https://mongoosejs.com/
- **Node.js:** https://nodejs.org/docs/

---

## 🎓 Learning Outcomes

After completing this project, you'll understand:
- ✅ Backend development with Node.js & Express
- ✅ Database design with MongoDB
- ✅ User authentication with JWT
- ✅ Password security with bcrypt
- ✅ Frontend-backend API integration
- ✅ Full-stack web development
- ✅ Modern UI/UX with CSS
- ✅ Responsive web design

---

## ✨ Success Criteria

Your application is working correctly when:
1. ✅ Can register new users from register page
2. ✅ Can login with registered email and password
3. ✅ Dashboard shows user profile after login
4. ✅ Logout removes token and redirects to login
5. ✅ Admin can login and view users/activities
6. ✅ All pages are responsive and mobile-friendly
7. ✅ No console errors
8. ✅ All API calls return expected data
9. ✅ Database has users and activities collections
10. ✅ Application looks professional with gradient background

---

## 🎉 Congratulations!

You now have a complete, working BCA Student Portal!

**Made by Vishal Kumar** - BCA Student, 2nd Semester

---

Need help? Check the troubleshooting section or review the main README.md file.
