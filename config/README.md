# Environment Configuration

This directory contains the environment configuration for the POS application.

## Files

- `env.example.js` - Example configuration file with all available options
- `env.js` - Your actual environment configuration (not tracked in git)
- `index.js` - Centralized configuration object and helper functions

## Setup

1. Copy `env.example.js` to `env.js`:
   ```bash
   cp config/env.example.js config/env.js
   ```

2. Update the values in `config/env.js` according to your environment

## Configuration Options

### API Configuration
- `API_BASE_URL` - Base URL for your API
- `API_TIMEOUT` - Request timeout in milliseconds

### App Configuration
- `APP_NAME` - Application name
- `APP_VERSION` - Application version
- `APP_ENVIRONMENT` - Environment (development, staging, production)

### Security
- `TOKEN_STORAGE_KEY` - Key for storing authentication token
- `USER_STORAGE_KEY` - Key for storing user data

### File System
- `CACHE_DIRECTORY` - Directory for caching files
- `PROFILE_PICTURE_CACHE` - Subdirectory for profile pictures

### Toast Messages
- `TOAST_DURATION` - Toast message duration in milliseconds
- `TOAST_POSITION` - Toast message position

### Development
- `DEBUG_MODE` - Enable/disable debug logging
- `LOG_LEVEL` - Logging level (debug, info, warn, error)

## Usage

Import the configuration in your components:

```javascript
import { CONFIG, getApiUrl, log, isDevelopment } from '../config';

// Use configuration values
const apiUrl = getApiUrl('login');
const isDev = isDevelopment();

// Log messages
log('This is a debug message', 'debug');
```

## Environment-Specific Configurations

### Development
```javascript
export const ENV_CONFIG = {
  API_BASE_URL: 'http://10.0.2.2:8000/api',
  APP_ENVIRONMENT: 'development',
  DEBUG_MODE: true,
  LOG_LEVEL: 'debug',
};
```

### Production
```javascript
export const ENV_CONFIG = {
  API_BASE_URL: 'https://your-production-api.com/api',
  APP_ENVIRONMENT: 'production',
  DEBUG_MODE: false,
  LOG_LEVEL: 'error',
};
```

## Security Notes

- Never commit `config/env.js` to version control
- Use different API URLs for different environments
- Disable debug mode in production
- Use secure storage keys that are environment-specific
