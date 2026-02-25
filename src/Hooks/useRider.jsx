import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import useAuth from './useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import UseAxiosSecure from './UseAxiosSecure';

const useRider = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();

    // Form states
    const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm();

    // Local states
    const [isLoading, setIsLoading] = useState(false);
    const [regions, setRegions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [submissionError, setSubmissionError] = useState(null);

    // Watch region field
    const selectedRegion = watch('region');

    // Load regions from warehouses.json
    useEffect(() => {
        const loadRegions = async () => {
            try {
                const response = await fetch('/warehouses.json');
                const data = await response.json();
                const uniqueRegions = [...new Set(data.map(item => item.region))];
                setRegions(uniqueRegions.sort());
            } catch (error) {
                console.error('Error loading regions:', error);
            }
        };
        loadRegions();
    }, []);

    // Load districts when region changes
    useEffect(() => {
        const loadDistricts = async () => {
            if (!selectedRegion) {
                setDistricts([]);
                return;
            }
            try {
                const response = await fetch('/warehouses.json');
                const data = await response.json();
                const filteredDistricts = data
                    .filter(item => item.region === selectedRegion)
                    .map(item => item.district);
                const uniqueDistricts = [...new Set(filteredDistricts)];
                setDistricts(uniqueDistricts.sort());
            } catch (error) {
                console.error('Error loading districts:', error);
                setDistricts([]);
            }
        };
        loadDistricts();
    }, [selectedRegion]);

    // Bike brands list
    const bikeBrands = [
        'Honda', 'Yamaha', 'Suzuki', 'TVS', 'Runner',
        'Bajaj', 'Hero', 'United', 'Walton', 'Other'
    ];

    // Create rider mutation
    const createRiderMutation = useMutation({
        mutationFn: (riderData) => axiosSecure.post('/riders', riderData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['riders'] });
            toast.success('Rider application submitted successfully!');
            setSubmissionError(null);
            reset();
            navigate('/dashboard/my-application');
        },
        onError: (error) => {
            console.error('Submission error:', error.response?.data);
            const errorMsg = error.response?.data?.message || 'Failed to submit application';
            setSubmissionError(errorMsg);
            toast.error(errorMsg);
        },
    });

    // Get current user's rider application
    const useMyRiderApplication = () => {
        return useQuery({
            queryKey: ['riders', 'my-application', user?.uid],
            queryFn: async () => {
                const response = await axiosSecure.get(`/riders?status=my-application`);
                return response.data?.data?.[0] || null;
            },
            enabled: !!user,
            staleTime: 30000,
        });
    };

    // Get all pending riders (for admin)
    const useAllPendingRiders = () => {
        return useQuery({
            queryKey: ['riders', 'pending'],
            queryFn: async () => {
                const response = await axiosSecure.get(`/riders?status=pending`);
                return response.data?.data || [];
            },
            staleTime: 30000,
        });
    };

    // Get all active riders (for admin)
    const useAllActiveRiders = () => {
        return useQuery({
            queryKey: ['riders', 'active'],
            queryFn: async () => {
                const response = await axiosSecure.get(`/riders?status=active`);
                return response.data?.data || [];
            },
            staleTime: 30000,
        });
    };

    // Get all inactive riders (for admin)
    const useAllInactiveRiders = () => {
        return useQuery({
            queryKey: ['riders', 'inactive'],
            queryFn: async () => {
                const response = await axiosSecure.get(`/riders?status=inactive`);
                return response.data?.data || [];
            },
            staleTime: 30000,
        });
    };

    // Form submission handler
    const onSubmit = async (formData) => {
        setIsLoading(true);
        setSubmissionError(null);

        try {
            const riderData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phoneNumber,
                drivingLicense: formData.drivingLicense,
                nid: formData.nid,
                region: formData.region,
                district: formData.district,
                bikeBrand: formData.bikeBrand,
                bikeModel: formData.bikeModel,
                bikeRegistration: formData.bikeRegistration,
                about: formData.about,
            };
            await createRiderMutation.mutateAsync(riderData);
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Update rider status (for admin)
    const updateStatusMutation = useMutation({
        mutationFn: ({ riderId, status }) =>
            axiosSecure.patch(`/riders/${riderId}`, { status }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['riders', 'pending'] });
            queryClient.invalidateQueries({ queryKey: ['riders', 'active'] });
            queryClient.invalidateQueries({ queryKey: ['riders', 'inactive'] });

            const action = variables.status === 'active' ? 'accepted' :
                variables.status === 'inactive' ? 'deactivated' : 'updated';
            toast.success(`Rider ${action} successfully!`);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        },
    });

    // Delete rider (for admin)
    const deleteRiderMutation = useMutation({
        mutationFn: (riderId) => axiosSecure.delete(`/riders/${riderId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['riders', 'pending'] });
            toast.success('Rider application deleted successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete rider');
        },
    });

    return {
        // Form methods
        register,
        handleSubmit,
        errors,
        submissionError,
        onSubmit,
        isLoading: isLoading || createRiderMutation.isPending,
        setValue,

        // Data
        regions,
        districts,
        bikeBrands,
        selectedRegion,

        // User data
        userName: user?.displayName || '',
        userEmail: user?.email || '',
        userPhone: user?.phoneNumber || '',

        // User's own application
        useMyRiderApplication,

        // Admin queries
        useAllPendingRiders,
        useAllActiveRiders,
        useAllInactiveRiders,

        // Admin mutations
        updateStatus: updateStatusMutation.mutateAsync,
        updateStatusLoading: updateStatusMutation.isPending,
        deleteRider: deleteRiderMutation.mutateAsync,
        deleteRiderLoading: deleteRiderMutation.isPending,
    };
};

export default useRider;