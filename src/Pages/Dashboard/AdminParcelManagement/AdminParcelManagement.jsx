// src/components/Admin/AdminParcelManagement.jsx
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    FaBox,
    FaUserTie,

    FaSearch,
    FaFilter,
    FaSync,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,

    FaTimesCircle,
    FaClock,
    FaUserCheck,
    FaUserSlash,
    FaUserClock,
    FaCreditCard,
    FaMoneyBillWave,
    FaSpinner
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { districtsData, getUniqueDistricts } from '../../../../public/districts';

const AdminParcelManagement = () => {
    const axiosSecure = UseAxiosSecure();
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDistrict, setFilterDistrict] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Get districts from local data
    const districts = useMemo(() => getUniqueDistricts(), []);

    // Get region for a specific district
    const getRegionFromDistrict = (district) => {
        const found = districtsData.find(d => d.district === district);
        return found?.region || null;
    };

    // Fetch all parcels with filters
    const {
        data: parcels = [],
        isLoading: parcelsLoading,
        refetch,
        isFetching
    } = useQuery({
        queryKey: ['admin-parcels', filterStatus, filterDistrict, searchTerm],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filterStatus && filterStatus !== 'all') params.append('status', filterStatus);
            if (filterDistrict && filterDistrict !== 'all') params.append('district', filterDistrict);
            if (searchTerm) params.append('search', searchTerm);

            const res = await axiosSecure.get(`/admin/parcels?${params.toString()}`);
            return res.data.data;
        }
    });

    // Fetch riders based on parcel's region when a parcel is selected
    const {
        data: availableRiders = [],
        isLoading: ridersLoading,
        refetch: refetchRiders
    } = useQuery({
        queryKey: ['available-riders', selectedParcel?._id, selectedParcel?.receiverDistrict],
        queryFn: async () => {
            if (!selectedParcel) return [];

            // Get the region for the parcel's district
            const region = getRegionFromDistrict(selectedParcel.receiverDistrict);

            const params = new URLSearchParams();
            if (region) {
                params.append('region', region);
            }
            params.append('type', 'available'); // Only get active riders

            const res = await axiosSecure.get(`/riders?${params.toString()}`);
            return res.data.data;
        },
        enabled: !!selectedParcel
    });

    // Check rider status for assignment
    const getRiderStatus = (rider, currentParcelId) => {
        const riderId = rider.userId || rider._id?.toString();

        // Check if rider is already assigned to this specific parcel
        const isAssignedToCurrentParcel = parcels.some(parcel =>
            parcel._id === currentParcelId &&
            (parcel.assignedRiderId === riderId || parcel.assignedRiderId === rider._id?.toString())
        );

        if (isAssignedToCurrentParcel) {
            return {
                type: 'already-assigned',
                label: 'Already Assigned',
                color: 'text-purple-600',
                bgColor: 'bg-purple-100',
                icon: FaUserTie,
                canAssign: false,
                message: 'This rider is already assigned to this parcel'
            };
        }

        // Check if rider is already assigned to any other active parcel
        const isAssignedToOtherParcel = parcels.some(parcel =>
            parcel._id !== currentParcelId &&
            (parcel.assignedRiderId === riderId || parcel.assignedRiderId === rider._id?.toString()) &&
            ['assigned', 'picked-up', 'in-transit', 'out-for-delivery'].includes(parcel.status)
        );

        if (isAssignedToOtherParcel) {
            return {
                type: 'busy',
                label: 'Already Assigned',
                color: 'text-orange-600',
                bgColor: 'bg-orange-100',
                icon: FaUserClock,
                canAssign: false,
                message: 'This rider is already assigned to another delivery'
            };
        }

        // Check rider's account status
        if (rider.status !== 'active') {
            return {
                type: 'inactive',
                label: 'Inactive',
                color: 'text-gray-600',
                bgColor: 'bg-gray-100',
                icon: FaUserSlash,
                canAssign: false,
                message: 'Rider account is inactive'
            };
        }

        // Rider is active and available for assignment
        return {
            type: 'active',
            label: 'Available',
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            icon: FaUserCheck,
            canAssign: true,
            message: 'Available for assignment'
        };
    };

    // Check if parcel is eligible for rider assignment
    const isEligibleForAssignment = (parcel) => {
        // Don't allow assignment for cancelled parcels
        if (parcel.status === 'cancelled') {
            return false;
        }

        // Don't show assign button if already assigned
        if (parcel.assignedRiderName) {
            return false;
        }

        // Don't allow assignment for pending payment parcels
        if (parcel.paymentStatus === 'pending') {
            return false;
        }

        // Allow assignment for paid parcels (both card and cash on delivery)
        return true;
    };

    // Get combined status display
    const getCombinedStatus = (parcel) => {
        // If parcel is assigned, show assigned status
        if (parcel.status === 'assigned') {
            return {
                label: 'Assigned to Rider',
                icon: FaUserTie,
                class: 'bg-purple-100 text-purple-800'
            };
        }

        // If payment is pending, show pending payment
        if (parcel.paymentStatus === 'pending') {
            return {
                label: 'Payment Pending',
                icon: FaClock,
                class: 'bg-yellow-100 text-yellow-800'
            };
        }

        // If payment is paid (by card) and not assigned
        if (parcel.paymentMethod === 'card' && parcel.paymentStatus === 'paid') {
            return {
                label: 'Paid',
                icon: FaCreditCard,
                class: 'bg-green-100 text-green-800'
            };
        }

        // If cash on delivery and payment is pending (but parcel is confirmed)
        if (parcel.paymentMethod === 'cash' && parcel.status === 'confirmed') {
            return {
                label: 'Cash on Delivery',
                icon: FaMoneyBillWave,
                class: 'bg-blue-100 text-blue-800'
            };
        }

        // Default to parcel status
        return {
            label: parcel.status?.charAt(0).toUpperCase() + parcel.status?.slice(1) || 'Unknown',
            icon: FaBox,
            class: 'bg-gray-100 text-gray-800'
        };
    };

    // Get button configuration based on parcel status
    const getActionButtonConfig = (parcel) => {
        // Don't show button for cancelled parcels
        if (parcel.status === 'cancelled') {
            return {
                show: false,
                button: (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md">
                        <FaTimesCircle className="mr-1" />
                        Cancelled
                    </span>
                )
            };
        }

        // If already assigned, show rider name instead of button
        if (parcel.assignedRiderName) {
            return {
                show: false,
                button: (
                    <div className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-md">
                        <FaUserTie className="text-purple-600" />
                        <span>{parcel.assignedRiderName}</span>
                    </div>
                )
            };
        }

        // Check if eligible for assignment
        if (!isEligibleForAssignment(parcel)) {
            // Show disabled button with explanation
            let disabledText = '';
            let tooltip = '';

            if (parcel.paymentStatus === 'pending') {
                disabledText = 'Payment Pending';
                tooltip = 'Cannot assign rider until payment is confirmed';
            } else {
                disabledText = 'Not Available';
                tooltip = 'Parcel is not eligible for rider assignment';
            }

            return {
                show: true,
                button: (
                    <span
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-100 rounded-md cursor-not-allowed"
                        title={tooltip}
                    >
                        <FaUserTie className="mr-1" />
                        {disabledText}
                    </span>
                )
            };
        }

        // Determine button style based on payment method
        let buttonConfig = {
            text: 'Assign Rider',
            class: parcel.paymentMethod === 'cash'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'  // Blue for cash on delivery
                : 'bg-green-600 hover:bg-green-700 text-white', // Green for card paid
            icon: FaUserTie
        };

        const Icon = buttonConfig.icon;

        const button = (
            <button
                onClick={() => handleAssignRider(parcel)}
                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${buttonConfig.class}`}
                title={`Assign rider to ${parcel.paymentMethod === 'cash' ? 'cash on delivery' : 'paid'} parcel`}
            >
                <Icon className="mr-1" />
                {buttonConfig.text}
            </button>
        );

        return {
            show: true,
            button: button
        };
    };

    // Assign rider mutation
    const assignRiderMutation = useMutation({
        mutationFn: ({ parcelId, riderId, riderName }) => {
            console.log('📦 Assigning rider:', { parcelId, riderId, riderName });

            const payload = {
                riderId: riderId.toString()
            };

            return axiosSecure.patch(`/admin/parcels/${parcelId}/assign-rider`, payload);
        },
        onSuccess: (data, variables) => {
            Swal.fire({
                icon: 'success',
                title: 'Rider Assigned Successfully!',
                html: `
                    <div class="text-left">
                        <p class="mb-2">✅ Parcel status updated to <span class="font-bold text-blue-600">"assigned to rider"</span></p>
                        <p class="text-sm bg-green-50 p-2 rounded">
                            <strong>${variables.riderName}</strong> has been assigned to<br>
                            Tracking ID: <span class="font-mono font-bold">${selectedParcel?.trackingId}</span>
                        </p>
                        <p class="text-sm mt-2 text-gray-600">
                            The rider has been notified about this assignment.
                        </p>
                    </div>
                `,
                timer: 4000,
                showConfirmButton: false
            });

            refetch();
            setSelectedParcel(null);
        },
        onError: (error) => {
            console.error('❌ Assignment error:', error);

            let errorMessage = 'Failed to assign rider. Please try again.';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            Swal.fire({
                icon: 'error',
                title: 'Assignment Failed!',
                text: errorMessage,
                confirmButtonColor: '#3b82f6'
            });
        }
    });

    const handleAssignRider = (parcel) => {
        setSelectedParcel(parcel);
    };

    const confirmAssignment = (rider) => {
        const riderStatus = getRiderStatus(rider, selectedParcel._id);

        if (!riderStatus.canAssign) {
            Swal.fire({
                icon: 'warning',
                title: 'Cannot Assign Rider',
                text: riderStatus.message,
                confirmButtonColor: '#3b82f6'
            });
            return;
        }

        const riderIdToSend = rider.userId || rider._id;

        Swal.fire({
            title: 'Assign Rider?',
            html: `
                <div class="text-left">
                    <p class="mb-3">Assign <strong class="text-blue-600">${rider.name}</strong> to parcel:</p>
                    
                    <div class="bg-gray-50 p-3 rounded-lg mb-3">
                        <p class="text-sm font-semibold">Parcel Details:</p>
                        <p class="text-sm font-mono font-bold">${selectedParcel.trackingId}</p>
                        <p class="text-sm">${selectedParcel.parcelName || 'N/A'}</p>
                        <p class="text-sm flex items-center gap-1 mt-1">
                            📍 ${selectedParcel.receiverDistrict || 'N/A'}
                        </p>
                        <p class="text-sm mt-2">
                            Payment: ${selectedParcel.paymentMethod === 'card' ? '💳 Card (Paid)' : '💵 Cash on Delivery'}
                        </p>
                        <p class="text-sm">
                            Current Status: <span class="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">${selectedParcel.status}</span>
                        </p>
                    </div>
                    
                    <div class="bg-blue-50 p-2 rounded text-sm text-blue-700">
                        ⚡ Parcel status will be updated to <span class="font-bold">"assigned to rider"</span>
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, assign rider',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                assignRiderMutation.mutate({
                    parcelId: selectedParcel._id,
                    riderId: riderIdToSend,
                    riderName: rider.name
                });
            }
        });
    };

    const clearFilters = () => {
        setFilterStatus('all');
        setFilterDistrict('all');
        setSearchTerm('');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-400 mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-gray-800">
                        <FaBox className="text-blue-600" />
                        Parcel Management
                    </h1>
                    <button
                        onClick={() => {
                            refetch();
                            if (selectedParcel) refetchRiders();
                        }}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={isFetching}
                    >
                        <FaSync className={`mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Filters Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <FaFilter className="mr-2" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>

                {/* Filters Section */}
                {showFilters && (
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="col-span-1 md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Search
                                </label>
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Tracking ID, Parcel Name, Customer..."
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Payment Pending</option>
                                    <option value="confirmed">Cash on Delivery</option>
                                    <option value="paid">Paid</option>
                                    <option value="assigned">Assigned to Rider</option>
                                    <option value="picked-up">Picked Up</option>
                                    <option value="in-transit">In Transit</option>
                                    <option value="out-for-delivery">Out for Delivery</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="failed">Failed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* District Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    District
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filterDistrict}
                                    onChange={(e) => setFilterDistrict(e.target.value)}
                                >
                                    <option value="all">All Districts</option>
                                    {districts.map(district => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Clear Filters
                            </button>
                            <button
                                onClick={() => refetch()}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-sm text-gray-600">Total Parcels</div>
                        <div className="text-2xl font-bold text-blue-600">{parcels.length}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-sm text-gray-600">Payment Pending</div>
                        <div className="text-2xl font-bold text-yellow-600">
                            {parcels.filter(p => p.paymentStatus === 'pending').length}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-sm text-gray-600">Cash on Delivery</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {parcels.filter(p => p.paymentMethod === 'cash' && p.paymentStatus === 'paid' && p.status !== 'assigned').length}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-sm text-gray-600">Paid (Card)</div>
                        <div className="text-2xl font-bold text-green-600">
                            {parcels.filter(p => p.paymentMethod === 'card' && p.paymentStatus === 'paid' && p.status !== 'assigned').length}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-sm text-gray-600">Assigned to Rider</div>
                        <div className="text-2xl font-bold text-purple-600">
                            {parcels.filter(p => p.status === 'assigned').length}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-sm text-gray-600">Delivered</div>
                        <div className="text-2xl font-bold text-green-600">
                            {parcels.filter(p => p.status === 'delivered').length}
                        </div>
                    </div>
                </div>

                {/* Parcels Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {parcelsLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <FaSpinner className="animate-spin text-4xl text-blue-600" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parcel Details</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rider</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {parcels.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                                                No parcels found
                                            </td>
                                        </tr>
                                    ) : (
                                        parcels.map((parcel) => {
                                            const actionConfig = getActionButtonConfig(parcel);
                                            const combinedStatus = getCombinedStatus(parcel);
                                            const StatusIcon = combinedStatus.icon;

                                            return (
                                                <tr key={parcel._id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className="font-mono text-sm font-semibold text-blue-600">
                                                            {parcel.trackingId}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm font-medium text-gray-900">{parcel.parcelName || 'N/A'}</div>
                                                        <div className="text-xs text-gray-500">
                                                            W: {parcel.weight || 'N/A'} | ${parcel.price || 0}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm text-gray-900">{parcel.senderName || 'N/A'}</div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            <FaPhone className="text-xs" />
                                                            {parcel.senderPhone || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-1 text-sm text-gray-900">
                                                            <FaMapMarkerAlt className="text-blue-600 text-xs" />
                                                            {parcel.receiverDistrict || 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 truncate max-w-37.5">
                                                            {parcel.receiverAddress || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${combinedStatus.class}`}>
                                                            <StatusIcon className="mr-1" />
                                                            {combinedStatus.label}
                                                            {parcel.paymentMethod === 'cash' && parcel.paymentStatus === 'paid' && parcel.status !== 'assigned' && (
                                                                <span className="ml-1 text-xs opacity-75">(COD)</span>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {parcel.assignedRiderName ? (
                                                            <div className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-md">
                                                                <FaUserTie className="text-purple-600" />
                                                                <span>{parcel.assignedRiderName}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-gray-500">Not assigned</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {actionConfig.button}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Rider Selection Modal - Keep the same as before */}
                {selectedParcel && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <FaUserTie className="text-blue-600" />
                                    Assign Rider to Parcel
                                </h3>
                                <button
                                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                    onClick={() => setSelectedParcel(null)}
                                >
                                    <span className="text-2xl">&times;</span>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto">
                                {/* Parcel Summary */}
                                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                    <p className="text-sm font-semibold text-blue-800 mb-3">Selected Parcel:</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Tracking ID:</span>
                                            <span className="font-mono ml-2 font-bold text-blue-600">{selectedParcel.trackingId}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Parcel Name:</span>
                                            <span className="ml-2 font-medium">{selectedParcel.parcelName || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Destination:</span>
                                            <span className="ml-2">{selectedParcel.receiverDistrict || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Region:</span>
                                            <span className="ml-2 font-medium text-purple-600">
                                                {getRegionFromDistrict(selectedParcel.receiverDistrict) || 'N/A'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Delivery Price:</span>
                                            <span className="ml-2 font-medium">${selectedParcel.price || 0}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Payment:</span>
                                            <span className="ml-2">
                                                {selectedParcel.paymentMethod === 'card' ? (
                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-md">
                                                        <FaCreditCard className="mr-1" /> Card (Paid)
                                                    </span>
                                                ) : selectedParcel.paymentMethod === 'cash' ? (
                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-md">
                                                        <FaMoneyBillWave className="mr-1" /> Cash on Delivery
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500">N/A</span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-600">Current Status:</span>
                                            <span className="ml-2">
                                                {getCombinedStatus(selectedParcel).label}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Rider Selection - Keep the same rider selection UI */}
                                <p className="text-sm font-medium text-gray-700 mb-3">
                                    Available Riders in {getRegionFromDistrict(selectedParcel.receiverDistrict) || 'this region'}:
                                </p>

                                {ridersLoading ? (
                                    <div className="flex justify-center py-8">
                                        <FaSpinner className="animate-spin text-3xl text-blue-600" />
                                    </div>
                                ) : availableRiders.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                        No riders available in {getRegionFromDistrict(selectedParcel.receiverDistrict) || 'this region'}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {availableRiders.map((rider) => {
                                            const riderStatus = getRiderStatus(rider, selectedParcel._id);
                                            const StatusIcon = riderStatus.icon;

                                            return (
                                                <div
                                                    key={rider._id}
                                                    className={`border rounded-lg p-4 ${riderStatus.canAssign
                                                        ? 'border-green-200 hover:border-green-400 cursor-pointer bg-white'
                                                        : 'border-gray-200 bg-gray-50'
                                                        } transition-all`}
                                                    onClick={() => riderStatus.canAssign && confirmAssignment(rider)}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        {/* Avatar */}
                                                        <div className="flex-shrink-0">
                                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${riderStatus.type === 'active' ? 'bg-green-500' :
                                                                riderStatus.type === 'already-assigned' ? 'bg-purple-500' :
                                                                    riderStatus.type === 'busy' ? 'bg-orange-500' :
                                                                        'bg-gray-500'
                                                                }`}>
                                                                {rider.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                        </div>

                                                        {/* Rider Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900">{rider.name}</h4>
                                                                    <div className="flex flex-wrap items-center gap-4 mt-1">
                                                                        <div className="text-sm flex items-center gap-1 text-gray-600">
                                                                            <FaPhone className="text-xs" />
                                                                            {rider.phone}
                                                                        </div>
                                                                        <div className="text-sm flex items-center gap-1 text-gray-600">
                                                                            <FaEnvelope className="text-xs" />
                                                                            {rider.email}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                                        <FaMapMarkerAlt className="text-xs" />
                                                                        {rider.district}, {rider.region}
                                                                    </div>
                                                                </div>

                                                                {/* Status Badge */}
                                                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${riderStatus.bgColor} ${riderStatus.color}`}>
                                                                    <StatusIcon className="text-xs" />
                                                                    {riderStatus.label}
                                                                </div>
                                                            </div>

                                                            {/* Assignment Button */}
                                                            <div className="mt-3 flex justify-end">
                                                                {riderStatus.canAssign ? (
                                                                    <button
                                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            confirmAssignment(rider);
                                                                        }}
                                                                    >
                                                                        <FaUserCheck className="mr-2" />
                                                                        Assign to this Rider
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md cursor-not-allowed"
                                                                        disabled
                                                                        title={riderStatus.message}
                                                                    >
                                                                        <StatusIcon className="mr-2" />
                                                                        {riderStatus.type === 'already-assigned' ? 'Already Assigned' :
                                                                            riderStatus.type === 'busy' ? 'Already Assigned' :
                                                                                'Not Available'}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                                <button
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={() => setSelectedParcel(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminParcelManagement;