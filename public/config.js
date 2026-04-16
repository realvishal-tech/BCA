/**
 * Frontend Configuration
 * Update these values based on your deployment environment
 */

const CONFIG = {
  // Production (Render Backend)
  PRODUCTION: {
    API_BASE: 'https://bca-student-portal.onrender.com',
    DESCRIPTION: 'Production Render Backend'
  },

  // Development (Local Backend)
  DEVELOPMENT: {
    API_BASE: 'http://localhost:5000',
    DESCRIPTION: 'Local Development Backend'
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

  // Log current configuration (for debugging)
  log() {
    const env = this.getEnvironment();
    const apiBase = this.getApiBase();
    console.log(`🌍 Environment: ${env}`);
    console.log(`📡 API Base: ${apiBase}`);
    console.log(`🏠 Hostname: ${window.location.hostname}`);
  }
};

// Log configuration on page load
window.addEventListener('DOMContentLoaded', () => {
  if (typeof CONFIG !== 'undefined') {
    CONFIG.log();
  }
});
