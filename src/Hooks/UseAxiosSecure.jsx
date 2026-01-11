import axios from 'axios';

// Create axios instance with base URL
const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add response interceptor for better error handling
axiosSecure.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response?.data || error.message);

        // You can add custom error handling here
        if (error.response?.status === 401) {
            // Handle unauthorized access
            console.log('User not authorized');
        }

        return Promise.reject(error);
    }
);

// Custom hook to use axiosSecure
const UseAxiosSecure = () => {
    return axiosSecure;
};

export default UseAxiosSecure;