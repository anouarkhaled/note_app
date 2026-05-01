import axios from 'axios';
import { ACCESS_TOKEN } from './constants';
 
const api=axios.create({
    baseURL:import.meta.env.VITE_API_URL
})
const AUTH_URLS = ['/api/token/', '/api/user/register/'];

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const isAuthEndpoint = AUTH_URLS.some(url => config.url?.includes(url));
        if (token && !isAuthEndpoint) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
(error)=>{
    return Promise.reject(error);

})
export default api;