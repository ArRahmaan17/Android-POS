import { CONFIG, log } from '../config';

export const debugNetworkRequest = (method, url, data, headers) => {
    if (CONFIG.DEBUG.ENABLED) {
        log('=== NETWORK REQUEST DEBUG ===', 'debug');
        log(`Method: ${method}`, 'debug');
        log(`URL: ${url}`, 'debug');
        log(`Data: ${JSON.stringify(data, null, 2)}`, 'debug');
        log(`Headers: ${JSON.stringify(headers, null, 2)}`, 'debug');
        log('============================', 'debug');
    }
};

export const debugNetworkResponse = (response) => {
    if (CONFIG.DEBUG.ENABLED) {
        log('=== NETWORK RESPONSE DEBUG ===', 'debug');
        log(`Status: ${response.status}`, 'debug');
        log(`Data: ${JSON.stringify(response.data, null, 2)}`, 'debug');
        log(`Headers: ${JSON.stringify(response.headers, null, 2)}`, 'debug');
        log('==============================', 'debug');
    }
};

export const debugNetworkError = (error) => {
    if (CONFIG.DEBUG.ENABLED) {
        log('=== NETWORK ERROR DEBUG ===', 'error');
        log(`Message: ${error.message}`, 'error');
        log(`Code: ${error.code}`, 'error');
        log(`Response: ${JSON.stringify(error.response?.data, null, 2)}`, 'error');
        log(`Status: ${error.response?.status}`, 'error');
        log('===========================', 'error');
    }
};
