# ⚡ BCA Student Portal - Quick Start (5 Minutes)

The fastest way to get the app running.

---

## 🎯 TL;DR Quick Steps

```bash
# 1. Go to server folder
cd server

# 2. Install dependencies
npm install

# 3. Start MongoDB (choose one)
brew services start mongodb-community   # Mac
# OR
docker run -d -p 27017:27017 mongo     # Docker

# 4. Start server
npm start

# 5. Open browser
http://localhost:5000
```

**Done!** 🎉

---

## 📝 Register & Test

1. **Go to Register**: http://localhost:5000/register
2. **Fill form**:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@gmail.com`
   - Password: `Test123`
   - Course: `BCA`
3. **Click Register** → Auto redirects to login
4. **Login** with your credentials
5. **See Dashboard** with your profile
6. **Click Logout**

---

## 🔐 Admin Access

Go to: **http://localhost:5000/admin**

Use:
- Email: `10717vishal@gmail.com`
- Password: `Vishal@@2004`

See all users and activity logs!

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Can't access localhost:5000 | Start server: `npm start` in server folder |
| MongoDB connection failed | Start MongoDB or use Docker |
| Port 5000 in use | Change PORT in `server/.env` |
| Only Gmail allowed | Use real @gmail.com email |
| Password validation fails | Use 6+ chars with letter + number |

---

## 📁 Project Structure

```
BCA/
├── server/          ← Backend (go here first)
│   ├── server.js    ← Main app
│   ├── package.json
│   └── .env
└── public/          ← Frontend (auto-served)
    ├── index.html   ← Login
    ├── register.html
    ├── dashboard.html
    ├── admin.html
    ├── admin-dashboard.html
    ├── style.css
    └── script.js
```

---

## ✅ Features to Try

- ✅ Register with Gmail only
- ✅ Login with JWT token
- ✅ View personal profile
- ✅ Logout tracking
- ✅ Admin dashboard
- ✅ User list table
- ✅ Activity logs
- ✅ Responsive design (try mobile view!)

---

## 🔗 Links

- **Login**: http://localhost:5000
- **Register**: http://localhost:5000/register
- **Dashboard**: http://localhost:5000/dashboard
- **Admin**: http://localhost:5000/admin

---

For **complete documentation**, see `README.md` or `SETUP_INSTRUCTIONS.md`

Enjoy! 🎓
