# 🎓 BCA Student Portal

A **production-quality**, fully functional web application for BCA students to manage authentication, profiles, and activity tracking.

---

## 🌟 Features

✅ **User Authentication**
- Register with Gmail-only validation
- Secure login with JWT tokens
- Password hashing with bcrypt
- Token expiration (24 hours)

✅ **Student Dashboard**
- View personal profile
- Auto-redirect when not logged in
- Activity tracking (VIEW_PAGE)
- One-click logout

✅ **Admin Panel**
- View all registered users
- Real-time activity logs
- Professional dashboard UI
- Sidebar navigation

✅ **Activity Tracking**
- LOGIN events
- VIEW_PAGE events
- LOGOUT events
- Timestamped records

✅ **Modern UI/UX**
- Gradient background (blue to purple)
- Glassmorphism design
- Responsive mobile-friendly layout
- Smooth animations & transitions
- Professional styling

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling (gradients, glassmorphism)
- **Vanilla JavaScript** - No frameworks (no dependencies)

---

## 📁 Project Structure

```
BCA/
├── server/
│   ├── server.js          # Express server & API routes
│   ├── package.json       # Node dependencies
│   └── .env               # Environment variables
├── public/
│   ├── index.html         # Login page
│   ├── register.html      # Registration page
│   ├── dashboard.html     # Student dashboard
│   ├── admin.html         # Admin login
│   ├── admin-dashboard.html # Admin panel
│   ├── style.css          # All styling
│   └── script.js          # All frontend logic
├── .gitignore             # Git ignore file
└── README.md              # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation & Setup

#### 1. Navigate to Server Directory
```bash
cd server
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment
Edit `server/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/bca-student-portal
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
PORT=5000
ADMIN_EMAIL=10717vishal@gmail.com
ADMIN_PASSWORD=Vishal@@2004
```

#### 4. Start MongoDB
Make sure MongoDB is running:
```bash
# On Linux/Mac with brew
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 mongo
```

#### 5. Start Server
```bash
npm start
# or
node server.js
```

You should see:
```
✅ MongoDB connected successfully
🚀 BCA Student Portal running at http://localhost:5000
📝 Login: http://localhost:5000
📚 Register: http://localhost:5000/register
🔐 Admin: http://localhost:5000/admin
```

#### 6. Open in Browser
```
http://localhost:5000
```

---

## 📝 User Flows

### Student Registration
1. Click "Register here" on login page
2. Fill form with valid Gmail
3. Password must be 6+ chars with letter + number
4. Submit → User saved in MongoDB
5. Auto-redirect to login

### Student Login
1. Enter Gmail and password
2. Submit → JWT generated
3. Token stored in localStorage
4. Redirect to dashboard
5. View profile, activity tracked

### Student Dashboard
1. Auto-fetches user profile
2. Shows welcome message
3. Displays email, course, registration date
4. Logout button sends LOGOUT activity
5. Removes token and redirects to login

### Admin Login
1. Navigate to `/admin`
2. Enter admin email & password
3. Submit → JWT with role='admin'
4. Redirect to admin dashboard

### Admin Dashboard
1. View all registered users table
2. View activity logs with filters
3. See timestamps and actions
4. Real-time data from MongoDB

---

## 🔐 Security Features

✅ **Password Security**
- Minimum 6 characters
- Must include letter + number
- Hashed with bcrypt (10 rounds)

✅ **Authentication**
- JWT tokens with 24h expiration
- Token validation on protected routes
- Bearer token in Authorization header

✅ **Email Validation**
- Gmail-only regex validation
- Prevents duplicate registrations
- Lowercase normalization

✅ **Protected Routes**
- `/api/profile` - requires valid token
- `/api/users` - admin role only
- `/api/activity` - admin role only
- `/api/logout` - requires authentication

✅ **Admin Credentials**
- Stored in `.env` only
- Never exposed in frontend code
- Separate login endpoint

---

## 📊 API Routes

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Student login
- `POST /api/admin-login` - Admin login
- `POST /api/logout` - Logout (requires token)

### User Data
- `GET /api/profile` - Get user profile (requires token)
- `GET /api/users` - Get all users (admin only)

### Activity
- `POST /api/activity` - Log activity (requires token)
- `GET /api/activity` - Get activity logs (admin only)

---

## 📱 Responsive Design

The application is fully responsive:
- **Mobile** (320px - 480px)
- **Tablet** (481px - 768px)
- **Desktop** (769px+)

CSS breakpoints ensure perfect display on all devices.

---

## 🎨 UI/UX Highlights

✨ **Color Scheme**
- Gradient Background: Blue (#667eea) → Purple (#764ba2)
- Text: White with opacity variations
- Accents: Light blue hover effects

✨ **Components**
- Glassmorphism with backdrop blur
- Smooth fade-in animations
- Rounded corners (10-20px)
- Soft shadows for depth

✨ **Interactions**
- Hover states with transforms
- Loading indicators
- Success/error messages
- Form validation feedback

---

## 📊 Database Schemas

### User Schema
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique, gmail only),
  password: String (hashed),
  course: String (BCA),
  createdAt: Date
}
```

### Activity Schema
```javascript
{
  email: String,
  action: String (LOGIN, VIEW_PAGE, LOGOUT),
  page: String,
  time: Date
}
```

---

## 🧪 Test Accounts

### Student Account
**Email:** test@gmail.com
**Password:** Password123

(Create your own in register page)

### Admin Account
**Email:** 10717vishal@gmail.com
**Password:** Vishal@@2004

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Start MongoDB service
```bash
brew services start mongodb-community
```

### Port Already in Use
```
Error: Port 5000 already in use
```
**Solution:** Change PORT in `.env` or kill process on port 5000
```bash
lsof -i :5000
kill -9 <PID>
```

### CORS Errors
**Solution:** Ensure frontend requests use `http://localhost:5000` (matching PORT in .env)

### Token Expired Error
**Solution:** Re-login to get new token

---

## 🔄 Workflow

```
1. User opens http://localhost:5000
   ↓
2. Checks if token in localStorage
   - No token → Shows Login page
   - Token exists → Redirects to Dashboard
   ↓
3. User registers (creates account)
   - Form validation
   - Password hashing
   - Store in MongoDB
   ↓
4. User logs in (gets JWT)
   - Verify credentials
   - Generate JWT token
   - Store in localStorage
   - Redirect to Dashboard
   ↓
5. Dashboard loads (fetches profile)
   - Send token in Authorization header
   - Backend verifies JWT
   - Returns user data
   - Activity tracked
   ↓
6. User logs out
   - LOGOUT activity tracked
   - Token removed from localStorage
   - Redirect to Login
```

---

## 📈 Scaling Considerations

For production deployment:
1. **Database**
   - Use MongoDB Atlas instead of local
   - Enable backups
   - Use connection pooling

2. **Security**
   - Set strong JWT_SECRET
   - Use HTTPS only
   - Implement rate limiting
   - Add CSRF protection

3. **Performance**
   - Add caching (Redis)
   - Implement pagination for tables
   - Compress assets
   - Use CDN for static files

4. **Monitoring**
   - Add logging (Winston, Bunyan)
   - Error tracking (Sentry)
   - Performance monitoring (New Relic)

---

## 👨‍💻 Developer Info

Made by **Vishal Kumar**  
BCA Student, 2nd Semester

---

## 📄 License

MIT License - Feel free to use and modify

---

## 🎯 What's Included

✅ Complete working backend  
✅ Complete working frontend  
✅ All API endpoints  
✅ Database implementation  
✅ Authentication system  
✅ Activity tracking  
✅ Admin dashboard  
✅ Responsive UI  
✅ Professional styling  
✅ Full documentation  

---

## 🚀 Deploy to Production

### Using Render/Railway/Heroku
1. Push to GitHub
2. Connect repository
3. Set environment variables
4. Deploy!

### Using Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
```

---

Enjoy your BCA Student Portal! 🎓