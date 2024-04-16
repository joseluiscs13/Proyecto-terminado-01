import axios from 'axios';
import { getEnvVariables } from '../helpers/getEnvVariables';

const {VITE_API_URL} = getEnvVariables();

const mdApi = axios.create({
    baseURL: VITE_API_URL
})

// TODO: configurar interceptores
mdApi.interceptors.request.use(config => {
    config.headers = {
        ...config.headers,
        'x-token': localStorage.getItem('token')
    };

    return config;
})

export default mdApi;