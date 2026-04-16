require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Environment Variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bca-student-portal';
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production_2024';
const PORT = process.env.PORT || 5000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// User Schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@gmail\.com$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  course: {
    type: String,
    enum: ['BCA'],
    default: 'BCA',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

// Activity Schema
const activitySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ['LOGIN', 'VIEW_PAGE', 'LOGOUT'],
    required: true,
  },
  page: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const Activity = mongoose.model('Activity', activitySchema);

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ===== API ROUTES =====

// 1. REGISTER
app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, course } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !course) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Gmail validation
    if (!/^[^\s@]+@gmail\.com$/.test(email)) {
      return res.status(400).json({ error: 'Only Gmail addresses are allowed' });
    }

    // Password validation: at least 6 characters, must include letter and number
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ error: 'Password must include at least one letter and one number' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      course: 'BCA',
    });

    await user.save();

    // Log activity
    await Activity.create({
      email,
      action: 'LOGIN',
      page: 'register',
      time: new Date(),
    });

    res.status(201).json({ 
      message: 'Registration successful! Redirecting to login...',
      redirect: '/index.html'
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// 2. LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Please register first' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log LOGIN activity
    await Activity.create({
      email,
      action: 'LOGIN',
      page: 'login',
      time: new Date(),
    });

    res.status(200).json({ 
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// 3. ADMIN LOGIN
app.post('/api/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check admin credentials from .env
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    // Generate JWT for admin
    const token = jwt.sign(
      { 
        email,
        role: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      message: 'Admin login successful',
      token,
      user: { email, role: 'admin' }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Admin login failed' });
  }
});

// 4. GET USER PROFILE
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// 5. LOGOUT
app.post('/api/logout', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;

    // Log LOGOUT activity
    await Activity.create({
      email,
      action: 'LOGOUT',
      page: 'dashboard',
      time: new Date(),
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// 6. TRACK ACTIVITY
app.post('/api/activity', authenticateToken, async (req, res) => {
  try {
    const { action, page } = req.body;
    const email = req.user.email;

    if (!action || !page) {
      return res.status(400).json({ error: 'Action and page are required' });
    }

    await Activity.create({
      email,
      action,
      page,
      time: new Date(),
    });

    res.status(201).json({ message: 'Activity logged' });
  } catch (err) {
    console.error('Activity tracking error:', err);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

// 7. GET ALL USERS (Admin only)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    // Check if admin (from token role)
    if (req.user.role !== 'admin' && req.user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 8. GET ACTIVITY LOGS (Admin only)
app.get('/api/activity', authenticateToken, async (req, res) => {
  try {
    // Check if admin
    if (req.user.role !== 'admin' && req.user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const activities = await Activity.find().sort({ time: -1 }).limit(1000);
    res.status(200).json({ activities });
  } catch (err) {
    console.error('Get activity error:', err);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin-dashboard.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 BCA Student Portal running at http://localhost:${PORT}`);
  console.log(`📝 Login: http://localhost:${PORT}`);
  console.log(`📚 Register: http://localhost:${PORT}/register`);
  console.log(`🔐 Admin: http://localhost:${PORT}/admin`);
});
