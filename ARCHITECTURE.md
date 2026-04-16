# 🔄 BCA Student Portal - System Architecture & Data Flow

Visual guide showing how the entire system works together.

---

## 📊 Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│          BROWSER (Frontend - Pure HTML/CSS/JS)             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  index.html      register.html      dashboard.html         │
│  (Login)         (Registration)     (Profile)              │
│                                                             │
│  admin.html      admin-dashboard.html                      │
│  (Admin Login)   (Admin Panel)                              │
│                                                             │
│  style.css (All Styling)  script.js (All Logic)            │
│                                                             │
└────────────┬────────────────────────────────────────────────┘
             │
             │ HTTP/FETCH
             │ Bearer Token (JWT)
             │
┌────────────▼────────────────────────────────────────────────┐
│         NODE.JS SERVER (Express.js)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  API Routes:                                               │
│  ├─ POST /api/register                                     │
│  ├─ POST /api/login                                        │
│  ├─ POST /api/admin-login                                  │
│  ├─ GET /api/profile (protected)                           │
│  ├─ POST /api/logout (protected)                           │
│  ├─ POST /api/activity (protected)                         │
│  ├─ GET /api/users (admin)                                 │
│  └─ GET /api/activity (admin)                              │
│                                                             │
│  Middleware:                                               │
│  ├─ CORS                                                   │
│  ├─ JSON Parser                                            │
│  ├─ JWT Verification (authenticateToken)                   │
│  └─ Static File Serving                                    │
│                                                             │
└────────────┬────────────────────────────────────────────────┘
             │
             │ MongoDB Query/Save
             │
┌────────────▼────────────────────────────────────────────────┐
│            MONGODB DATABASE                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Collections:                                              │
│  ├─ users (firstName, lastName, email, password, ...)     │
│  └─ activities (email, action, page, time)                │
│                                                             │
│  Schema Validation:                                        │
│  ├─ User: unique email, bcrypt password                    │
│  └─ Activity: enum actions (LOGIN, LOGOUT, VIEW_PAGE)     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────┐
│ User Opens http://localhost:5000/       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │ Check localStorage  │
        │ for token?          │
        └────┬───────────┬────┘
             │           │
          YES│           │NO
             │           │
        ┌────▼────┐  ┌───▼──────────┐
        │Dashboard│  │ Login Page   │
        │(protected)  │(index.html) │
        └─────────┘  └───┬──────────┘
                         │
                    ┌────▼─────────────────────┐
                    │ User enters email+    │
                    │ password              │
                    │ Clicks Login         │
                    └────┬──────────────────┘
                         │
                         ▼
                ┌─────────────────────────┐
                │ POST /api/login         │
                │ (Client → Server)       │
                └────┬───────────────────┘
                     │
                     ▼
            ┌──────────────────────────┐
            │ Server:                  │
            │ 1. Find user by email    │
            │ 2. Compare passwords     │
            │    (bcrypt)              │
            │ 3. If correct:           │
            │    - Generate JWT        │
            │    - Log LOGIN activity  │
            │    - Return token+user   │
            │ 4. If wrong:             │
            │    - Return error        │
            └────┬───────────────────┘
                 │
         ┌───────┴─────────┐
         │                 │
      SUCCESS            ERROR
         │                 │
         ▼                 ▼
  ┌──────────────┐  ┌─────────────────┐
  │ Store JWT in │  │ Show error msg   │
  │ localStorage │  │ (invalid creds)  │
  │              │  │                  │
  │ Redirect to  │  │ Stay on login    │
  │ dashboard    │  └─────────────────┘
  └──────────────┘
```

---

## 📝 Registration Flow

```
index.html
    │
    ├─ Click "Register here"
    │
    ▼
register.html
    │
    ├─ User fills form:
    │  ├─ firstName
    │  ├─ lastName
    │  ├─ email (Gmail only)
    │  ├─ password (6+ chars, letter+number)
    │  └─ course (BCA)
    │
    └─ Click "Register"
        │
        ▼
    JavaScript validates:
    ├─ All fields filled? ✓
    ├─ Valid Gmail? ✓
    ├─ Password strong enough? ✓
    │
    ├─ POST /api/register
    │  {
    │    firstName: "John",
    │    lastName: "Doe",
    │    email: "john@gmail.com",
    │    password: "Test123",
    │    course: "BCA"
    │  }
    │
    ▼
Server validates:
├─ All fields present? ✓
├─ Email matches Gmail regex? ✓
├─ Password strong enough? ✓
├─ Email unique? ✓
│
├─ Hash password with bcrypt
├─ Save user to MongoDB
├─ Log LOGIN activity
│
└─ Return: "Registration successful!"
    │
    ▼
Show success message (2 seconds)
    │
    ▼
Auto-redirect to login page
    │
    ▼
User logs in with credentials
```

---

## 👥 Dashboard Access Flow

```
┌──────────────────────────┐
│ User logged in           │
│ Token in localStorage    │
└──────────┬───────────────┘
           │
           ▼
    ┌─────────────────────┐
    │ Open dashboard.html │
    └────┬────────────────┘
         │
         ├─ Check for token
         │   (localStorage)
         │
    ┌────┴─────────────────┐
    │                      │
  NO│                      │YES
    │                      │
┌───▼────────────┐  ┌──────▼────────────────┐
│ No token found │  │ Token exists         │
└───┼────────────┘  └──────┬────────────────┘
    │                      │
    ▼                      ▼
Redirect to         GET /api/profile
login page          (Bearer token)
                          │
                    ┌─────┴────────┐
                    │              │
                 VALID          INVALID
                    │              │
                    ▼              ▼
            ┌────────────────┐  ┌─────────────┐
            │ Return user:   │  │ Remove token│
            │ - firstName    │  │ Redirect to │
            │ - lastName     │  │ login       │
            │ - email        │  └─────────────┘
            │ - course       │
            │ - createdAt    │
            └────┬───────────┘
                 │
                 ▼
         ┌──────────────────┐
         │ Display Profile: │
         │ - Welcome [Name] │
         │ - Email: ...     │
         │ - Course: BCA    │
         │ - Joined: ...    │
         └────┬─────────────┘
              │
              ├─ POST /api/activity
              │  (Track VIEW_PAGE)
              │
              ▼
         ┌──────────────────┐
         │ Show Logout btn  │
         │ Click → POST     │
         │ /api/logout      │
         │ → log LOGOUT     │
         │ → remove token   │
         │ → redirect login │
         └──────────────────┘
```

---

## 🔐 Admin Dashboard Access Flow

```
┌──────────────────────────┐
│ Separate admin page      │
│ /admin (admin.html)      │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Admin enters:            │
│ Email: 10717vishal...    │
│ Password: Vishal@@2004   │
│ (from .env file)         │
└──────────┬───────────────┘
           │
           ▼
POST /api/admin-login
│  {
│    email: "10717vishal@gmail.com",
│    password: "Vishal@@2004"
│  }
│
▼
Server checks:
├─ Email === ADMIN_EMAIL? ✓
├─ Password === ADMIN_PASSWORD? ✓
│
├─ Generate JWT with role='admin'
└─ Log LOGIN activity
    │
    ▼
Store JWT in localStorage
    │
    ▼
Redirect to admin-dashboard.html
    │
    ▼
┌───────────────────────────┐
│ Admin Dashboard:          │
│                           │
│ Sidebar:                  │
│ ├─ Users Tab             │
│ └─ Activity Logs Tab     │
│                           │
│ Users Table:             │
│ ├─ GET /api/users        │
│ ├─ List all students     │
│ └─ Show: name, email,    │
│    course, date          │
│                           │
│ Activity Logs:           │
│ ├─ GET /api/activity     │
│ ├─ List all activities   │
│ └─ Show: email, action,  │
│    page, time            │
│                           │
│ Admin can switch tabs     │
│ Admin can logout          │
└───────────────────────────┘
```

---

## 🗄️ Data Models

### User Document
```
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  firstName: "John",
  lastName: "Doe",
  email: "john@gmail.com",
  password: "$2a$10$...",  // bcrypt hashed
  course: "BCA",
  createdAt: ISODate("2024-01-15T10:30:00Z")
}
```

### Activity Document
```
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  email: "john@gmail.com",
  action: "LOGIN",  // or "LOGOUT", "VIEW_PAGE"
  page: "login",    // or "dashboard", "register"
  time: ISODate("2024-01-15T10:30:45Z")
}
```

---

## 🔄 Request/Response Examples

### Register Request
```
POST /api/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@gmail.com",
  "password": "Test123",
  "course": "BCA"
}

Response:
{
  "message": "Registration successful!",
  "redirect": "/index.html"
}
```

### Login Request
```
POST /api/login
Content-Type: application/json

{
  "email": "john@gmail.com",
  "password": "Test123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@gmail.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Profile Request
```
GET /api/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response:
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@gmail.com",
    "course": "BCA",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 🔐 Token Structure

JWT Token (contains 3 parts):

```
Header (Token Type & Algorithm):
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload (User Data):
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "iat": 1705316400,
  "exp": 1705402800  // expires in 24 hours
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  "your_super_secret_jwt_key_change_in_production_2024"
)

Full Token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoiam9obkBnbWFpbC5jb20iLCJpYXQiOjE3MDUzMTY0MDAsImV4cCI6MTcwNTQwMjgwMH0.signature...
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────┐
│ User Interaction    │
│ (Browser)           │
└────────╱────────────┘
         │
         │ Fills Form
         │ Clicks Button
         │
         ▼
    ┌─────────────────────────┐
    │ JavaScript Validation   │
    │ (script.js)             │
    │ ├─ Required fields      │
    │ ├─ Email format (regex) │
    │ ├─ Password strength    │
    │ └─ Show errors if fail  │
    └────────┬────────────────┘
             │
             │ If valid
             │
             ▼
    ┌─────────────────────────┐
    │ Fetch API Request       │
    │ POST to /api/...        │
    │ With Authorization      │
    │ (if needed)             │
    └────────┬────────────────┘
             │
             │ HTTP
             │
             ▼
    ┌─────────────────────────┐
    │ Express Middleware      │
    │ ├─ CORS check           │
    │ ├─ JSON parse           │
    │ ├─ JWT verify           │
    │ │  (if protected)       │
    │ └─ Continue/Reject      │
    └────────┬────────────────┘
             │
             │ If authorized
             │
             ▼
    ┌─────────────────────────┐
    │ API Route Handler       │
    │ ├─ Validate inputs      │
    │ ├─ Check database       │
    │ ├─ Hash password        │
    │ ├─ Generate token       │
    │ └─ Return response      │
    └────────┬────────────────┘
             │
             │ MongoDB Operation
             │
             ▼
    ┌─────────────────────────┐
    │ MongoDB                 │
    │ ├─ Find/Insert/Update   │
    │ ├─ Apply schema rules   │
    │ ├─ Return data          │
    │ └─ Send to server       │
    └────────┬────────────────┘
             │
             │ Response JSON
             │
             ▼
    ┌─────────────────────────┐
    │ Express Send Response   │
    │ ├─ Status code          │
    │ ├─ JSON body            │
    │ └─ Headers              │
    └────────┬────────────────┘
             │
             │ HTTP
             │
             ▼
    ┌─────────────────────────┐
    │ Browser Receives        │
    │ ├─ Parse JSON           │
    │ ├─ Check status         │
    │ ├─ If error → show msg  │
    │ ├─ If success:          │
    │ │  ├─ Store token       │
    │ │  ├─ Update DOM        │
    │ │  └─ Redirect page     │
    │ └─ Call endpoint        │
    └─────────────────────────┘
```

---

## 🚦 Activity Tracking Flow

```
Event Triggered:
├─ User opens dashboard      → Tracks "VIEW_PAGE"
├─ User logs in              → Tracks "LOGIN"
├─ User logs out             → Tracks "LOGOUT"
└─ Custom activity           → Tracks custom action

    │
    ▼
JavaScript calls:
trackActivity(action, page)
    │
    ├─ Check if token exists
    ├─ Build payload:
    │  {
    │    action: "LOGIN",
    │    page: "dashboard"
    │  }
    │
    ▼
POST /api/activity
Authorization: Bearer {token}
    │
    ▼
Server:
├─ Verify token
├─ Extract email from token
├─ Create activity record:
│  {
│    email: "john@gmail.com",
│    action: "LOGIN",
│    page: "dashboard",
│    time: <now>
│  }
├─ Save to MongoDB
└─ Send response
    │
    ▼
Admin can later view:
GET /api/activity
    │
    ▼
All activities displayed in
Admin Dashboard Activity Logs table
```

---

## 🔒 Security Layer

```
┌─────────────────────────┐
│ User Credentials        │
│ email, password         │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Frontend Validation     │
│ ├─ Required fields      │
│ ├─ Email regex          │
│ └─ Password rules       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ HTTPS (Recommended)     │
│ Encrypted transmission  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Server Validation       │
│ ├─ Required fields      │
│ ├─ Email regex          │
│ ├─ Unique email check   │
│ └─ Password strength    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Password Hashing        │
│ bcryptjs (10 rounds)    │
│ Password never stored   │
│ plain text              │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Database Storage        │
│ ├─ Hashed password      │
│ ├─ Unique email         │
│ └─ Indexed queries      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Authentication          │
│ ├─ Generate JWT         │
│ ├─ 24h expiration       │
│ ├─ Secure signature     │
│ └─ Bearer token header  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Protected Routes        │
│ ├─ Verify JWT token     │
│ ├─ Check expiration     │
│ ├─ Validate signature   │
│ └─ Allow/Deny access    │
└─────────────────────────┘
```

---

## 📈 Application Lifecycle

```
Session Start:
┌─ User opens http://localhost:5000
├─ Browser loads index.html
├─ Parse HTML
├─ Load style.css
├─ Load script.js
├─ JavaScript checks localStorage
└─ Show login page or redirect to dashboard

User Registers:
┌─ Fills register form
├─ JavaScript validates
├─ POST /api/register
├─ Server validates, hashes, saves
├─ Activity logged (LOGIN)
└─ Redirect to login page

User Logs In:
┌─ Fills login form
├─ JavaScript validates
├─ POST /api/login
├─ Server verifies, generates JWT
├─ Activity logged (LOGIN)
├─ Token stored in localStorage
└─ Redirect to dashboard

Session Active:
┌─ Dashboard loaded
├─ JavaScript checks token
├─ GET /api/profile with token
├─ Activity logged (VIEW_PAGE)
├─ Display profile data
└─ User can interact with page

User Logs Out:
┌─ Click logout button
├─ POST /api/logout
├─ Activity logged (LOGOUT)
├─ Token removed from localStorage
└─ Redirect to login page

Session End:
┌─ Token removed
├─ localStorage cleared
└─ All user state reset
```

---

Made by **Vishal Kumar** - BCA Student, 2nd Semester 🎓
