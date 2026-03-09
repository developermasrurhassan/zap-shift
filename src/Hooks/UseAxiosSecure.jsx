import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';
import { useEffect, useRef } from 'react';

// Create axios instance with base URL
const axiosSecure = axios.create({
    baseURL: 'https://zap-shift-server-mu-ashy.vercel.app',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Custom hook to use axiosSecure
const UseAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    const interceptorSet = useRef(false);

    useEffect(() => {
        // Only set up interceptors once
        if (interceptorSet.current) return;

        interceptorSet.current = true;
        // console.log('🔧 Setting up axios interceptors');

        // Request interceptor for auth
        const requestInterceptor = axiosSecure.interceptors.request.use(
            async (config) => {
                console.log(`📤 [AXIOS] ${config.method?.toUpperCase()} ${config.url}`);

                // Skip token for public routes if needed
                const publicRoutes = ['/login', '/register', '/track']; // Add your public routes
                const isPublicRoute = publicRoutes.some(route => config.url?.includes(route));

                if (isPublicRoute) {
                    console.log('🌐 Public route, skipping token');
                    return config;
                }

                // Always get fresh token when request is made
                if (user) {
                    try {
                        const token = await user.getIdToken();
                        console.log(`🔑 Token attached for: ${config.url}`);
                        config.headers.Authorization = `Bearer ${token}`;
                    } catch (error) {
                        console.error('Failed to get token:', error);
                        await logOut();
                        navigate('/signin');
                        return Promise.reject(error);
                    }
                } else {
                    console.log('⚠️ No user for protected route:', config.url);
                    // Don't proceed without user for protected routes
                    navigate('/signin');
                    return Promise.reject(new Error('No authenticated user'));
                }

                return config;
            },
            (error) => {
                console.error('❌ Request interceptor error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor for handling 401/403
        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => {
                console.log(`✅ [AXIOS] Response from ${response.config.url}:`, response.status);
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                // If no config, just reject
                if (!originalRequest) {
                    return Promise.reject(error);
                }

                const status = error.response?.status;
                const errorData = error.response?.data;

                console.error('❌ [AXIOS] Response error:', {
                    url: originalRequest.url,
                    status,
                    message: error.message,
                    data: errorData
                });

                // Handle specific error cases
                switch (status) {
                    case 401: // Unauthorized - token expired
                        if (!originalRequest._retry) {
                            originalRequest._retry = true;
                            console.log('🔄 Attempting token refresh for:', originalRequest.url);

                            try {
                                if (user) {
                                    const freshToken = await user.getIdToken(true);
                                    originalRequest.headers.Authorization = `Bearer ${freshToken}`;
                                    console.log('✅ Token refreshed, retrying request');
                                    return axiosSecure(originalRequest);
                                } else {
                                    console.log('🚫 No user for token refresh');
                                    await logOut();
                                    navigate('/signin');
                                }
                            } catch (refreshError) {
                                console.error('❌ Token refresh failed:', refreshError);
                                await logOut();
                                navigate('/signin');
                            }
                        } else {
                            console.log('🚫 Already tried refresh, logging out');
                            await logOut();
                            navigate('/signin');
                        }
                        break;

                    case 403: // Forbidden
                        console.log('🚫 Forbidden access');
                        navigate('/forbidden');
                        break;

                    case 404: // Not found
                        console.log('🔍 Resource not found:', originalRequest.url);
                        // Don't navigate, just let component handle it
                        break;

                    case 500: // Server error
                        console.log('💥 Server error');
                        // Show user-friendly message
                        break;

                    default:
                        console.log(`⚠️ Unhandled status code: ${status}`);
                }

                return Promise.reject(error);
            }
        );

        // Cleanup interceptors on unmount
        return () => {
            console.log('🧹 Cleaning up axios interceptors');
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
            interceptorSet.current = false;
        };
    }, [logOut, navigate, user]);

    return axiosSecure;
};

export default UseAxiosSecure;