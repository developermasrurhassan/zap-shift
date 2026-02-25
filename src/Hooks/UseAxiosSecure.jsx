import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';
import { useEffect, useRef } from 'react';

// Create axios instance with base URL
const axiosSecure = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for debugging (ONLY ONCE - outside hook)
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

// Add response interceptor for debugging (ONLY ONCE - outside hook)
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
    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    const interceptorInitialized = useRef(false);

    useEffect(() => {
        // Prevent multiple interceptor setups
        if (interceptorInitialized.current) return;

        interceptorInitialized.current = true;

        // Request interceptor for auth
        const requestInterceptor = axiosSecure.interceptors.request.use(
            async config => {
                if (user) {
                    try {
                        // Use getIdToken() without true for normal requests (uses cache)
                        // This prevents quota issues
                        const token = await user.getIdToken();
                        config.headers.Authorization = `Bearer ${token}`;
                    } catch (error) {
                        console.error('Failed to get token:', error);
                        // If token refresh fails, redirect to login
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
            response => response,
            async error => {
                const originalRequest = error.config;
                const status = error.response?.status;

                console.log('🔍 Response error interceptor:', { status, url: originalRequest?.url });

                // Handle 403 - Forbidden
                if (status === 403) {
                    navigate('/forbidden');
                }

                // Handle 401 - Unauthorized (token expired)
                else if (status === 401 && !originalRequest?._retry) {
                    originalRequest._retry = true;

                    try {
                        if (user) {
                            // Force refresh token on 401
                            const freshToken = await user.getIdToken(true);
                            originalRequest.headers.Authorization = `Bearer ${freshToken}`;
                            return axiosSecure(originalRequest); // Retry the request
                        }
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        // If refresh fails, logout
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
            interceptorInitialized.current = false;
        };
    }, [user, logOut, navigate]);

    return axiosSecure;
};

export default UseAxiosSecure;