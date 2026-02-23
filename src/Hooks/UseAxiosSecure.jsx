import axios from 'axios';
import useAuth from './useAuth';

// Create axios instance with base URL
const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for debugging
axiosSecure.interceptors.request.use(
    config => {
        console.log(`📤 [AXIOS] ${config.method?.toUpperCase()} ${config.url}`);
        if (config.data) {
            console.log('📦 [AXIOS] Request data:', config.data);
        }
        return config;
    },
    error => {
        console.error('❌ [AXIOS] Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
axiosSecure.interceptors.response.use(
    response => {
        console.log(`✅ [AXIOS] Response from ${response.config.url}:`, {
            status: response.status,
            data: response.data
        });
        return response;
    },
    error => {
        console.error('❌ [AXIOS] Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

// Custom hook to use axiosSecure
const UseAxiosSecure = () => {
    const { user } = useAuth();

    // Add auth interceptor - FIXED VERSION
    axiosSecure.interceptors.request.use(async config => {
        if (user) {
            try {
                // 🔥 FIX: Use getIdToken(true) to get a fresh token
                const token = await user.getIdToken(true);
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error('Failed to get token:', error);
            }
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    return axiosSecure;
};

export default UseAxiosSecure;