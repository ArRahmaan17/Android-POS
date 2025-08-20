import axios from "axios";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

const objectToHttpParams = (data) => {
    return `?${Object.keys(data).map((key) => {
        return `&${key}=${data[key]}`;
    })}`.split(',').join('');
}
const httpHelper = async (method = "GET", url, data) => {
    let params = '';
    if (method === "GET" && data !== undefined) {
        params = objectToHttpParams(data);
    }
    try {
        let response = await axios({
            url: `http://10.0.2.2:8000/api/${url}${params}`,
            method,
            data,
            headers: { 'Content-Type': 'application/json' }
        });
        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `${response.data.message}`,
        });
        return { code: response.status, data: response.data };
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: `${error.response.data.message.replace(/(\w{1,})\.(\w{1,})/s, "$1 $2")}`,
        });
        console.error(error.response)
        return { code: error.status, data: error.response.data };
    }
}

export { httpHelper, objectToHttpParams };