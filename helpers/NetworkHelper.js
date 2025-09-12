import NetInfo from '@react-native-community/netinfo';
import { log } from '../config';

export const checkNetworkConnection = async () => {
    try {
        const netInfo = await NetInfo.fetch();
        log(`Network connection status: ${netInfo.isConnected ? 'Connected' : 'Disconnected'}`, 'info');

        if (netInfo.isConnected) {
            log(`Connection type: ${netInfo.type}`, 'debug');
            if (netInfo.details) {
                log(`Connection details: ${JSON.stringify(netInfo.details)}`, 'debug');
            }
        }

        return {
            isConnected: netInfo.isConnected,
            type: netInfo.type,
            details: netInfo.details
        };
    } catch (error) {
        log(`Error checking network connection: ${error.message}`, 'error');
        return {
            isConnected: false,
            type: 'unknown',
            details: null
        };
    }
};

export const waitForConnection = async (timeout = 10000) => {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error('Network connection timeout'));
        }, timeout);

        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected) {
                clearTimeout(timeoutId);
                unsubscribe();
                resolve(state);
            }
        });

        // Check immediately
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                clearTimeout(timeoutId);
                unsubscribe();
                resolve(state);
            }
        });
    });
};
