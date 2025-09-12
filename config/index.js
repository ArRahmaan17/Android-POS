import { ENV_CONFIG } from './env';

// Centralized configuration object
export const CONFIG = {
  // API Configuration
  API: {
    BASE_URL: ENV_CONFIG.API_BASE_URL,
    ASSET_BASE_URL: ENV_CONFIG.ASSET_BASE_URL,
    TIMEOUT: ENV_CONFIG.API_TIMEOUT,
  },

  // App Configuration
  APP: {
    NAME: ENV_CONFIG.APP_NAME,
    VERSION: ENV_CONFIG.APP_VERSION,
    ENVIRONMENT: ENV_CONFIG.APP_ENVIRONMENT,
  },

  // Storage Keys
  STORAGE: {
    TOKEN: ENV_CONFIG.TOKEN_STORAGE_KEY,
    USER: ENV_CONFIG.USER_STORAGE_KEY,
  },

  // File System
  FILE_SYSTEM: {
    CACHE_DIRECTORY: ENV_CONFIG.CACHE_DIRECTORY,
    PROFILE_PICTURE_CACHE: ENV_CONFIG.PROFILE_PICTURE_CACHE,
    COMPANY_PICTURE_CACHE: ENV_CONFIG.COMPANY_PICTURE_CACHE,
    PRODUCT_PICTURE_CACHE: ENV_CONFIG.PRODUCT_PICTURE_CACHE,
    PRODUCT_TEMP_PICTURE_CACHE: ENV_CONFIG.PRODUCT_TEMP_PICTURE_CACHE,
  },

  // Toast Configuration
  TOAST: {
    DURATION: ENV_CONFIG.TOAST_DURATION,
    POSITION: ENV_CONFIG.TOAST_POSITION,
  },
  NUMBER: {
    DEFAULT_DEBOUNCE_TIME: ENV_CONFIG.DEFAULT_DEBOUNCE_TIME,
  },

  // Development
  DEBUG: {
    ENABLED: ENV_CONFIG.DEBUG_MODE,
    LOG_LEVEL: ENV_CONFIG.LOG_LEVEL,
  },

  // Validation Rules
  VALIDATION: {
    USERNAME: {
      MIN_LENGTH: 5,
      MAX_LENGTH: 15,
    },
    PASSWORD: {
      MIN_LENGTH: 5,
      MAX_LENGTH: 15,
    },
  },
};

// Helper functions
export const getApiUrl = (endpoint) => {
  return `${CONFIG.API.BASE_URL}/${endpoint}`;
};

export const isDevelopment = () => {
  return CONFIG.APP.ENVIRONMENT === 'development';
};

export const isProduction = () => {
  return CONFIG.APP.ENVIRONMENT === 'production';
};

export const log = (message, level = 'info') => {
  if (CONFIG.DEBUG.ENABLED) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${typeof message === 'object' || Array.isArray(message) ? JSON.stringify(message) : message}`);
  }
};

export default CONFIG;
