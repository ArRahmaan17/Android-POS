// Environment Configuration Example
// Copy this file to env.js and update the values for your environment

export const ENV_CONFIG = {
  // API Configuration
  API_BASE_URL: 'http://10.0.2.2:8000/api',
  API_TIMEOUT: 10000,

  // App Configuration
  APP_NAME: 'POS',
  APP_VERSION: '1.0.0',
  APP_ENVIRONMENT: 'development',

  // Security
  TOKEN_STORAGE_KEY: 'token',
  USER_STORAGE_KEY: 'user',

  // File System
  CACHE_DIRECTORY: 'cache',
  PROFILE_PICTURE_CACHE: 'profile_pictures',
  PRODUCT_PICTURE_CACHE: 'product_pictures',
  // Toast Messages
  TOAST_DURATION: 3000,
  TOAST_POSITION: 'top',
  DEFAULT_DEBOUNCE_TIME: 1000,

  // Development
  DEBUG_MODE: true,
  LOG_LEVEL: 'debug',

  // Production Configuration (uncomment for production)
  // API_BASE_URL: 'https://your-production-api.com/api',
  // APP_ENVIRONMENT: 'production',
  // DEBUG_MODE: false,
  // LOG_LEVEL: 'error',
};
