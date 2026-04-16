/**
 * BCA Student Portal - Configuration
 * Automatically detects environment and sets correct API endpoint
 * Supports: Local Development, Netlify (nd-bca.netlify.app), Render Backend
 */

const CONFIG = {
  // Production (Render Backend)
  PRODUCTION: {
    API_BASE: 'https://bca-student-portal.onrender.com',
    DESCRIPTION: 'Production Render Backend',
    TIMEOUT: 30000
  },

  // Development (Local Backend)
  DEVELOPMENT: {
    API_BASE: 'http://localhost:5000',
    DESCRIPTION: 'Local Development Backend',
    TIMEOUT: 10000
  },

  // Auto-detect environment
  getApiBase() {
    const hostname = window.location.hostname;
    
    // Localhost or 127.0.0.1 → Development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return this.DEVELOPMENT.API_BASE;
    }
    
    // Everything else → Production
    return this.PRODUCTION.API_BASE;
  },

  // Get current environment
  getEnvironment() {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'DEVELOPMENT';
    }
    return 'PRODUCTION';
  },

  // Get timeout based on environment
  getTimeout() {
    return this.getEnvironment() === 'DEVELOPMENT' 
      ? this.DEVELOPMENT.TIMEOUT 
      : this.PRODUCTION.TIMEOUT;
  },

  // Check backend health
  async checkBackendHealth() {
    try {
      const response = await fetch(`${this.getApiBase()}/api/health`, {
        method: 'GET',
        timeout: 5000
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  },

  // Log current configuration (for debugging)
  log() {
    const env = this.getEnvironment();
    const apiBase = this.getApiBase();
    console.log('%c🌍 BCA Portal Configuration', 'color: #667eea; font-weight: bold; font-size: 14px;');
    console.log(`%c✅ Environment: ${env}`, 'color: #10b981; font-size: 12px;');
    console.log(`%c📡 API Base: ${apiBase}`, 'color: #3b82f6; font-size: 12px;');
    console.log(`%c🏠 Frontend URL: ${window.location.hostname}`, 'color: #f59e0b; font-size: 12px;');
    console.log(`%c⏱️  API Timeout: ${this.getTimeout()}ms`, 'color: #8b5cf6; font-size: 12px;');
  }
};

// Initialize configuration on page load
document.addEventListener('DOMContentLoaded', () => {
  CONFIG.log();
  
  // Check backend connection
  CONFIG.checkBackendHealth().then(isHealthy => {
    if (isHealthy) {
      console.log('%c✅ Backend is Connected', 'color: #10b981; font-weight: bold;');
    } else {
      console.warn('%c⚠️  Backend may be offline. Some features might not work.', 'color: #ef4444; font-weight: bold;');
    }
  });
});
