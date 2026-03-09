import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

// Create axios instance with base URL
const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Custom hook to use axiosSecure
const UseAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Request interceptor for auth
        const requestInterceptor = axiosSecure.interceptors.request.use(
            async config => {
                console.log(`📤 [AXIOS] ${config.method?.toUpperCase()} ${config.url}`);
                if (config.data) {
                    console.log('📦 [AXIOS] Request data:', config.data);
                }

                if (user) {
                    try {
                        const token = await user.getIdToken();
                        config.headers.Authorization = `Bearer ${token}`;
                    } catch (error) {
                        console.error('Failed to get token:', error);
                        await logOut();
                        navigate('/signin');
                    }
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for handling 401/403
        const responseInterceptor = axiosSecure.interceptors.response.use(
            response => {
                console.log(`✅ [AXIOS] Response from ${response.config.url}:`, {
                    status: response.status,
                    data: response.data
                });
                return response;
            },
            async error => {
                const originalRequest = error.config;
                const status = error.response?.status;

                console.error('❌ [AXIOS] Response error:', {
                    url: error.config?.url,
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });

                // Handle 403 - Forbidden
                if (status === 403) {
                    navigate('/forbidden');
                }
                // Handle 401 - Unauthorized (token expired)
                else if (status === 401 && !originalRequest?._retry) {
                    originalRequest._retry = true;

                    try {
                        if (user) {
                            const freshToken = await user.getIdToken(true);
                            originalRequest.headers.Authorization = `Bearer ${freshToken}`;
                            return axiosSecure(originalRequest);
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        await logOut();
                        navigate('/signin');
                    }
                }
                // If already retried and still 401, logout
                else if (status === 401 && originalRequest?._retry) {
                    await logOut();
                    navigate('/signin');
                }

                return Promise.reject(error);
            }
        );

        // Cleanup interceptors on unmount
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [user, logOut, navigate]);

    return axiosSecure;
};

export default UseAxiosSecure;