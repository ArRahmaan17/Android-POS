# 🔧 Troubleshooting Guide

## Network Error Issues

### Problem: "Network Error" atau "No internet connection"

**Root Cause:** API server tidak berjalan atau tidak dapat diakses.

### Solutions:

#### 1. **Start Your API Server**
```bash
# Pastikan API server Anda berjalan di port 8000
# Contoh untuk Laravel:
php artisan serve --host=0.0.0.0 --port=8000

# Contoh untuk Node.js:
npm start
# atau
node server.js
```

#### 2. **Check Server Status**
```bash
# Test koneksi ke server
npm run test-network
```

#### 3. **Verify API Endpoints**
Pastikan endpoint berikut tersedia:
- `POST /api/login`
- `POST /api/update-profile`
- `GET /api/me`

#### 4. **Network Configuration**

**For Android Emulator:**
- Use `http://10.0.2.2:8000/api` ✅
- Don't use `localhost` atau `127.0.0.1` ❌

**For iOS Simulator:**
- Use `http://localhost:8000/api` ✅
- Or use your computer's IP address

**For Physical Device:**
- Use your computer's IP address: `http://192.168.x.x:8000/api`
- Make sure device and computer are on same network

#### 5. **Update Environment Configuration**

Edit `config/env.js`:
```javascript
export const ENV_CONFIG = {
  // For Android Emulator
  API_BASE_URL: 'http://10.0.2.2:8000/api',
  ASSET_BASE_URL: 'http://10.0.2.2:8000',
  
  // For iOS Simulator
  // API_BASE_URL: 'http://localhost:8000/api',
  // ASSET_BASE_URL: 'http://localhost:8000',
  
  // For Physical Device (replace with your IP)
  // API_BASE_URL: 'http://192.168.1.100:8000/api',
  // ASSET_BASE_URL: 'http://192.168.1.100:8000',
};
```

### Debug Steps:

1. **Check Console Logs**
   - Enable debug mode in `config/env.js`
   - Look for network request logs

2. **Test Individual Endpoints**
   ```bash
   curl -X POST http://10.0.2.2:8000/api/login \
     -H "Content-Type: application/json" \
     -d '{"username":"test","password":"test"}'
   ```

3. **Check Firewall**
   - Make sure port 8000 is not blocked
   - Allow connections from emulator/simulator

4. **Restart Everything**
   ```bash
   # Restart API server
   # Restart Expo development server
   expo start --clear
   ```

### Common Error Messages:

| Error | Solution |
|-------|----------|
| `Network Error` | Start API server |
| `timeout of 5000ms exceeded` | Check server status |
| `ECONNREFUSED` | Server not running |
| `401 Unauthorized` | Check authentication token |
| `404 Not Found` | Check API endpoint URL |

### Quick Fix Commands:

```bash
# Test network
npm run test-network

# Setup environment
npm run setup-env

# Clear cache and restart
expo start --clear
```

### Still Having Issues?

1. Check if your API server is actually running
2. Verify the correct IP address and port
3. Test with a simple curl request
4. Check Expo logs for detailed error messages
5. Make sure your API server accepts CORS requests from the app
