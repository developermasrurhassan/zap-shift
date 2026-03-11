// src/Hooks/useTracking.js
import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useUserRole from './useUserRole';
import useAxios from './useAxios';
import useAxiosSecure from './useAxiosSecure';

const useTracking = () => {
    const { user } = useAuth();
    const { isAdmin, isRider } = useUserRole();
    const axios = useAxios();
    const axiosSecure = useAxiosSecure();

    // Public tracking - no auth required
    const usePublicTracking = (trackingId) => {
        return useQuery({
            queryKey: ['public-tracking', trackingId],
            queryFn: async () => {
                if (!trackingId) return null;
                try {
                    const res = await axios.get(`/track/${trackingId}`);
                    if (!res?.data?.success) {
                        throw new Error(res?.data?.message || 'Failed to fetch tracking data');
                    }
                    return res.data.data;
                } catch (error) {
                    console.error('Public tracking error:', error);
                    throw error;
                }
            },
            enabled: !!trackingId,
            staleTime: 30000, // 30 seconds
            retry: 1,
        });
    };

    // User tracking - for logged in users to track their own parcels
    const useUserTracking = (trackingId) => {
        return useQuery({
            queryKey: ['user-tracking', trackingId, user?.email],
            queryFn: async () => {
                if (!trackingId || !user?.email) return null;

                try {
                    // First get parcel by tracking ID
                    const trackingRes = await axiosSecure.get(`/track/${trackingId}`);
                    return trackingRes.data.data;
                } catch (error) {
                    console.error('User tracking error:', error);
                    throw error;
                }
            },
            enabled: !!trackingId && !!user?.email,
            staleTime: 30000,
            retry: 1,
        });
    };

    // Rider tracking - for riders to track assigned parcels by ID
    const useRiderTracking = (parcelId) => {
        return useQuery({
            queryKey: ['rider-tracking', parcelId, user?.uid],
            queryFn: async () => {
                if (!parcelId || !user?.uid) return null;

                try {
                    const res = await axiosSecure.get(`/rider/track/${parcelId}`);
                    return res.data.data;
                } catch (error) {
                    console.error('Rider tracking error:', error);
                    throw error;
                }
            },
            enabled: !!parcelId && !!user?.uid && isRider,
            staleTime: 30000,
            retry: 1,
        });
    };

    // Admin tracking list - get all parcels with tracking info
    const useAdminTrackingList = (filters = {}) => {
        return useQuery({
            queryKey: ['admin-tracking-list', filters.status, filters.search, filters.district],
            queryFn: async () => {
                const params = new URLSearchParams();

                if (filters.status && filters.status !== 'all') {
                    params.append('status', filters.status);
                }
                if (filters.search) {
                    params.append('search', filters.search);
                }
                if (filters.district && filters.district !== 'all') {
                    params.append('district', filters.district);
                }

                const res = await axiosSecure.get(`/admin/tracking?${params.toString()}`);
                return res.data;
            },
            enabled: isAdmin,
            staleTime: 30000,
            retry: 1,
        });
    };

    // Admin single tracking - get specific parcel by tracking ID
    const useAdminTracking = (trackingId) => {
        return useQuery({
            queryKey: ['admin-tracking', trackingId],
            queryFn: async () => {
                if (!trackingId) return null;

                try {
                    const res = await axiosSecure.get(`/admin/track/${trackingId}`);
                    return res.data.data;
                } catch (error) {
                    console.error('Admin tracking error:', error);
                    throw error;
                }
            },
            enabled: !!trackingId && isAdmin,
            staleTime: 30000,
            retry: 1,
        });
    };

    // Get status configuration
    const getStatusConfig = (status) => {
        const config = {
            'pending': {
                color: 'warning',
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-200',
                icon: 'FaClock',
                label: 'Pending',
                progress: 10
            },
            'confirmed': {
                color: 'info',
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                border: 'border-blue-200',
                icon: 'FaCheckCircle',
                label: 'Confirmed',
                progress: 20
            },
            'assigned': {
                color: 'primary',
                bg: 'bg-purple-100',
                text: 'text-purple-800',
                border: 'border-purple-200',
                icon: 'FaUser',
                label: 'Assigned',
                progress: 30
            },
            'picked-up': {
                color: 'secondary',
                bg: 'bg-indigo-100',
                text: 'text-indigo-800',
                border: 'border-indigo-200',
                icon: 'FaTruck',
                label: 'Picked Up',
                progress: 40
            },
            'in-transit': {
                color: 'accent',
                bg: 'bg-orange-100',
                text: 'text-orange-800',
                border: 'border-orange-200',
                icon: 'FaTruck',
                label: 'In Transit',
                progress: 60
            },
            'out-for-delivery': {
                color: 'info',
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                border: 'border-blue-200',
                icon: 'FaTruck',
                label: 'Out for Delivery',
                progress: 80
            },
            'delivered': {
                color: 'success',
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-200',
                icon: 'FaCheckCircle',
                label: 'Delivered',
                progress: 100
            },
            'failed': {
                color: 'error',
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-200',
                icon: 'FaExclamationTriangle',
                label: 'Failed',
                progress: 0
            },
            'cancelled': {
                color: 'ghost',
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                border: 'border-gray-200',
                icon: 'FaExclamationTriangle',
                label: 'Cancelled',
                progress: 0
            }
        };
        return config[status] || config.pending;
    };

    // Calculate progress based on status
    const getProgress = (status) => {
        const config = getStatusConfig(status);
        return config.progress;
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return {
        // Tracking queries
        usePublicTracking,
        useUserTracking,
        useRiderTracking,
        useAdminTracking,
        useAdminTrackingList,

        // Helper functions
        getStatusConfig,
        getProgress,
        formatDate,
    };
};

export default useTracking;