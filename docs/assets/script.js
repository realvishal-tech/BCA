// GitHub Pages + External API Version
// Configure API endpoint below

const API_BASE = 'https://bca-student-portal.onrender.com'; // Change this to your Render.com URL after deployment

// Get current page
const currentPage = document.location.pathname.split('/').pop() || 'index.html';

// ===== UTILITY FUNCTIONS =====

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

function getUserFromToken() {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (e) {
    return null;
  }
}

function showMessage(element, message, type = 'success') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  
  const form = element.closest('form') || element;
  form.insertBefore(messageDiv, form.firstChild);
  
  setTimeout(() => messageDiv.remove(), 5000);
}

function isValidGmail(email) {
  return /^[^\s@]+@gmail\.com$/.test(email);
}

function isValidPassword(password) {
  return password.length >= 6 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

function makeApiCall(method, endpoint, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const token = getToken();
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE}${endpoint}`, options).then(response => {
    if (response.status === 401 || response.status === 403) {
      removeToken();
      window.location.href = './index.html';
    }
    return response.json();
  });
}

function trackActivity(action, page) {
  if (!getToken()) return;
  
  makeApiCall('POST', '/api/activity', {
    action,
    page,
  }).catch(err => console.log('Activity tracking completed'));
}

// ===== PAGE SPECIFIC FUNCTIONS =====

// REGISTER PAGE
function initRegisterPage() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      showMessage(form, 'All fields are required', 'error');
      return;
    }

    if (!isValidGmail(email)) {
      showMessage(form, 'Only Gmail addresses are allowed', 'error');
      return;
    }

    if (!isValidPassword(password)) {
      showMessage(form, 'Password must be at least 6 characters with letter and number', 'error');
      return;
    }

    try {
      const response = await makeApiCall('POST', '/api/register', {
        firstName,
        lastName,
        email,
        password,
        course: 'BCA',
      });

      if (response.error) {
        showMessage(form, response.error, 'error');
      } else {
        showMessage(form, response.message, 'success');
        setTimeout(() => {
          window.location.href = './index.html';
        }, 2000);
      }
    } catch (err) {
      showMessage(form, 'Registration failed. Please try again.', 'error');
    }
  });
}

// LOGIN PAGE
function initLoginPage() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  // Check if already logged in
  if (getToken()) {
    window.location.href = './dashboard.html';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showMessage(form, 'Email and password are required', 'error');
      return;
    }

    try {
      const response = await makeApiCall('POST', '/api/login', {
        email,
        password,
      });

      if (response.error) {
        showMessage(form, response.error, 'error');
      } else {
        setToken(response.token);
        showMessage(form, 'Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = './dashboard.html';
        }, 1500);
      }
    } catch (err) {
      showMessage(form, 'Login failed. Please try again.', 'error');
    }
  });
}

// DASHBOARD PAGE
function initDashboardPage() {
  const token = getToken();
  if (!token) {
    window.location.href = './index.html';
    return;
  }

  // Track page view
  trackActivity('VIEW_PAGE', 'dashboard');

  // Fetch and display user profile
  makeApiCall('GET', '/api/profile')
    .then(response => {
      if (response.error) {
        removeToken();
        window.location.href = './index.html';
      } else {
        const user = response.user;
        const fullName = `${user.firstName} ${user.lastName}`;
        
        document.getElementById('welcomeMessage').textContent = `Welcome, ${fullName} 👋`;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userCourse').textContent = user.course;
        
        const registrationDate = new Date(user.createdAt).toLocaleDateString();
        document.getElementById('registrationDate').textContent = registrationDate;
      }
    })
    .catch(err => {
      removeToken();
      window.location.href = './index.html';
    });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    trackActivity('LOGOUT', 'dashboard');
    
    setTimeout(() => {
      removeToken();
      window.location.href = './index.html';
    }, 500);
  });
}

// ADMIN LOGIN PAGE
function initAdminPage() {
  const form = document.getElementById('adminLoginForm');
  if (!form) return;

  // Check if already logged in as admin
  const token = getToken();
  if (token) {
    const user = getUserFromToken();
    if (user && user.role === 'admin') {
      window.location.href = './admin-dashboard.html';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;

    if (!email || !password) {
      showMessage(form, 'Email and password are required', 'error');
      return;
    }

    try {
      const response = await makeApiCall('POST', '/api/admin-login', {
        email,
        password,
      });

      if (response.error) {
        showMessage(form, response.error, 'error');
      } else {
        setToken(response.token);
        showMessage(form, 'Admin login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = './admin-dashboard.html';
        }, 1500);
      }
    } catch (err) {
      showMessage(form, 'Admin login failed. Please try again.', 'error');
    }
  });
}

// ADMIN DASHBOARD PAGE
function initAdminDashboardPage() {
  const token = getToken();
  const user = getUserFromToken();
  
  if (!token || user.role !== 'admin') {
    window.location.href = './admin.html';
    return;
  }

  // Load users and activities on page load
  loadUsers();
  loadActivities();

  // Sidebar click handlers
  document.getElementById('usersTab').addEventListener('click', () => {
    setActiveTab('users');
    loadUsers();
  });

  document.getElementById('activitiesTab').addEventListener('click', () => {
    setActiveTab('activities');
    loadActivities();
  });

  // Logout
  document.getElementById('adminLogoutBtn').addEventListener('click', () => {
    removeToken();
    window.location.href = './admin.html';
  });
}

function setActiveTab(tab) {
  // Update sidebar
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.remove('active');
  });
  
  if (tab === 'users') {
    document.getElementById('usersTab').classList.add('active');
  } else {
    document.getElementById('activitiesTab').classList.add('active');
  }

  // Update sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  if (tab === 'users') {
    document.getElementById('usersSection').classList.add('active');
  } else {
    document.getElementById('activitiesSection').classList.add('active');
  }
}

function loadUsers() {
  makeApiCall('GET', '/api/users')
    .then(response => {
      if (response.error) {
        document.getElementById('usersTable').innerHTML = `<tr><td colspan="4">Error loading users</td></tr>`;
      } else {
        const users = response.users;
        let html = '';

        users.forEach(user => {
          const registrationDate = new Date(user.createdAt).toLocaleDateString();
          html += `
            <tr>
              <td>${user.firstName} ${user.lastName}</td>
              <td>${user.email}</td>
              <td><span class="badge">${user.course}</span></td>
              <td>${registrationDate}</td>
            </tr>
          `;
        });

        document.getElementById('usersTable').innerHTML = html || '<tr><td colspan="4">No users found</td></tr>';
      }
    });
}

function loadActivities() {
  makeApiCall('GET', '/api/activity')
    .then(response => {
      if (response.error) {
        document.getElementById('activitiesTable').innerHTML = `<tr><td colspan="4">Error loading activities</td></tr>`;
      } else {
        const activities = response.activities;
        let html = '';

        activities.forEach(activity => {
          const time = new Date(activity.time).toLocaleString();
          let badgeClass = 'badge';
          
          if (activity.action === 'LOGIN') badgeClass += ' login';
          else if (activity.action === 'LOGOUT') badgeClass += ' logout';
          else if (activity.action === 'VIEW_PAGE') badgeClass += ' view';

          html += `
            <tr>
              <td>${activity.email}</td>
              <td><span class="${badgeClass}">${activity.action}</span></td>
              <td>${activity.page}</td>
              <td>${time}</td>
            </tr>
          `;
        });

        document.getElementById('activitiesTable').innerHTML = html || '<tr><td colspan="4">No activities found</td></tr>';
      }
    });
}

// ===== INITIALIZE PAGE ON LOAD =====

document.addEventListener('DOMContentLoaded', () => {
  if (currentPage === 'register.html' || currentPage === 'register') {
    initRegisterPage();
  } else if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
    initLoginPage();
  } else if (currentPage === 'dashboard.html' || currentPage === 'dashboard') {
    initDashboardPage();
  } else if (currentPage === 'admin.html' || currentPage === 'admin') {
    initAdminPage();
  } else if (currentPage === 'admin-dashboard.html' || currentPage === 'admin-dashboard') {
    initAdminDashboardPage();
  }
});
