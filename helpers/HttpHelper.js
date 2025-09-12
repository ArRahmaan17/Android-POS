import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { CONFIG, getApiUrl, log } from "../config";
import { checkNetworkConnection } from "./NetworkHelper";
import { debugNetworkRequest, debugNetworkResponse, debugNetworkError } from "./DebugHelper";
import * as FileSystem from "expo-file-system";

const downloadOrCahceFile = async (url, folder, fileName) => {
    const cacheDirectory = FileSystem.cacheDirectory + folder;
    const fileInfo = await FileSystem.getInfoAsync(cacheDirectory);
    const filePath = cacheDirectory + "/" + fileName;
    log(fileInfo);
    if (!fileInfo.exists) {
        log(`Downloading profile picture from ${url} to ${filePath}`);
        await FileSystem.makeDirectoryAsync(cacheDirectory, {
            intermediates: true,
        });
        await FileSystem.downloadAsync(url, filePath);
    }
    log(`Profile picture cached at ${filePath}`);
    return filePath;
};

const objectToHttpParams = (data, prefix = '') => {
    const query = Object.keys(data).map(key => {
        const value = data[key];
        const paramKey = prefix ? `${prefix}[${key}]` : key;

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            // rekursif kalau nested object
            return objectToHttpParams(value, paramKey);
        } else if (Array.isArray(value)) {
            // array -> jadi multiple param
            return value.map((v, i) => `${encodeURIComponent(paramKey)}[${i}]=${encodeURIComponent(v)}`).join('&');
        } else {
            return `${encodeURIComponent(paramKey)}=${encodeURIComponent(value)}`;
        }
    });

    return query.filter(Boolean).join('&');
};
const httpHelper = async (method = "GET", url, data, headers = {
    "Content-Type": "application/json",
}) => {
    const networkStatus = await checkNetworkConnection();
    if (!networkStatus.isConnected) {
        Toast.show({
            type: 'error',
            text1: 'Network Error',
            text2: 'No internet connection. Please check your network settings.',
        });
        return { code: 0, data: { message: 'No internet connection' } };
    }
    let token = await SecureStore.getItemAsync(CONFIG.STORAGE.TOKEN);
    let user = JSON.parse(await SecureStore.getItemAsync(CONFIG.STORAGE.USER));
    console.log(user, "user http helper");
    log(`Making ${method} request to ${url}`, 'info');
    log(`Token: ${token ? 'Present' : 'Not found'}`, 'debug');
    log(`Network: ${networkStatus.type}`, 'debug');

    let params = undefined;
    if (method === "GET" && data !== undefined) {
        params = objectToHttpParams(data);
    }

    try {
        const requestUrl = getApiUrl(url) + ((params !== undefined) ? `?${params}` : '');
        const requestHeaders = {
            'Authorization': `Bearer ${token}`,
            'x-customer-user-id': user?.user?.id,
            'x-customer-company-id': user?.company?.id,
            ...headers
        };

        debugNetworkRequest(method, requestUrl, data, requestHeaders);

        let response = await axios({
            url: requestUrl,
            method,
            data,
            timeout: CONFIG.API.TIMEOUT,
            headers: requestHeaders
        });

        debugNetworkResponse(response);

        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `${response.data.message}`,
        });

        log(`Request to ${getApiUrl(url)} successful`, 'info');
        return { code: response.status, data: response.data };
    } catch (error) {
        debugNetworkError(error);
        log(`Request to ${getApiUrl(url)} failed: ${error.message}`, 'error');

        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: `${error?.response?.data?.message !== undefined ? error?.response?.data?.message.replace(/(\w{1,})\.(\w{1,})/s, "$1 $2") : "Unexpected Error. Try Again Later"}`,
        });

        switch (error.response?.status) {
            case 401:
                log('Unauthorized access, removing token', 'warn');
                SecureStore.deleteItemAsync(CONFIG.STORAGE.TOKEN);
                break;
            default:
                break;
        }
        return { code: error.response?.status, data: error.response?.data };
    }
}
const removeDuplicate = (array) => {
    return Array.from(new Set(array));
};
const handleChange = (e, key, stateFn) => {
    stateFn((prevstate) => ({ ...prevstate, [key]: e }));
};

export { httpHelper, objectToHttpParams, handleChange, downloadOrCahceFile, removeDuplicate };