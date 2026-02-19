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

    // Form states - FIX: Use proper default values
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

                // Extract unique regions
                const uniqueRegions = [...new Set(data.map(item => item.region))];
                setRegions(uniqueRegions.sort());
            } catch (error) {
                console.error('Error loading regions:', error);
                // Remove toast - too annoying
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

                // Filter districts by selected region
                const filteredDistricts = data
                    .filter(item => item.region === selectedRegion)
                    .map(item => item.district);

                // Remove duplicates and sort
                const uniqueDistricts = [...new Set(filteredDistricts)];
                setDistricts(uniqueDistricts.sort());
            } catch (error) {
                console.error('Error loading districts:', error);
                setDistricts([]);
            }
        };

        loadDistricts();
    }, [selectedRegion, setValue]);

    // Set user data when user changes - REMOVE THIS
    // useEffect(() => {
    //     if (user) {
    //         setValue('name', user.displayName || '');
    //         setValue('email', user.email || '');
    //         if (user.phoneNumber) {
    //             setValue('phoneNumber', user.phoneNumber);
    //         }
    //     }
    // }, [user, setValue]);

    // Bike brands list
    const bikeBrands = [
        'Honda', 'Yamaha', 'Suzuki', 'TVS', 'Runner',
        'Bajaj', 'Hero', 'United', 'Walton', 'Other'
    ];

    // Create rider mutation - USE THIS INSTEAD OF onSubmit function
    const createRiderMutation = useMutation({
        mutationFn: (riderData) => axiosSecure.post('/riders', riderData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['riders'] });
            toast.success('Rider application submitted successfully!');
            submissionError(null);
            reset();
            navigate('/dashboard/pending-rider');
        },
        onError: (error) => {
            console.error('Submission error:', error.response?.data);
            setSubmissionError(error.response?.data?.message || 'Failed to submit application');
            toast.error(error.response?.data?.message || 'Failed to submit application');
        },
    });

    // NEW onSubmit function using mutation
    const onSubmit = async (formData) => {
        setIsLoading(true);

        try {
            // Prepare data to match backend structure
            const riderData = {
                // Personal info
                name: formData.name,
                email: formData.email,
                phone: formData.phoneNumber,

                // Documents
                drivingLicense: formData.drivingLicense,
                nid: formData.nid,

                // Location
                region: formData.region,
                district: formData.district,

                // Bike info
                bikeBrand: formData.bikeBrand,
                bikeModel: formData.bikeModel,
                bikeRegistration: formData.bikeRegistration,

                // About
                about: formData.about,
            };

            console.log('Submitting rider data:', riderData);

            // Use the mutation
            await createRiderMutation.mutateAsync(riderData);

        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get riders by status - FIX response format
    const useRidersByStatus = (status) => {
        return useQuery({
            queryKey: ['riders', status],
            queryFn: async () => {
                const response = await axiosSecure.get(`/riders?status=${status}`);
                console.log('Riders response:', response.data);
                return response.data.data || []; // Extract data array
            },
            enabled: !!status,
        });
    };

    // Specific status queries
    const usePendingRiders = () => useRidersByStatus('pending');
    const useActiveRiders = () => useRidersByStatus('active');
    const useInactiveRiders = () => useRidersByStatus('inactive');

    // Update rider status
    const updateStatusMutation = useMutation({
        mutationFn: ({ riderId, status }) =>
            axiosSecure.patch(`/riders/${riderId}`, { status }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['riders'] });
            const action = variables.status === 'active' ? 'accepted' :
                variables.status === 'inactive' ? 'deactivated' : 'updated';
            toast.success(`Rider ${action} successfully!`);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        },
    });

    // Delete rider
    const deleteRiderMutation = useMutation({
        mutationFn: (riderId) => axiosSecure.delete(`/riders/${riderId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['riders'] });
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

        createRider: createRiderMutation.mutateAsync,
        createRiderLoading: createRiderMutation.isPending,

        // Read
        useRidersByStatus,
        usePendingRiders,
        useActiveRiders,
        useInactiveRiders,

        // Update
        updateStatus: updateStatusMutation.mutateAsync,
        updateStatusLoading: updateStatusMutation.isPending,

        // Delete
        deleteRider: deleteRiderMutation.mutateAsync,
        deleteRiderLoading: deleteRiderMutation.isPending,
    };
};

export default useRider;