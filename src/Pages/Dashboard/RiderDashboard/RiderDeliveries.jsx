// src/Pages/Dashboard/RiderDashboard/RiderDeliveries.jsx
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    FaTruck,
    FaBox,
    FaCheckCircle,
    FaClock,
    FaSpinner,
    FaExclamationTriangle,
    FaMapMarkerAlt,
    FaUser,
    FaPhone,
    FaArrowRight,
    FaCheck,
    FaPlay,
    FaCamera,
    FaSearch,
    FaFilter
} from 'react-icons/fa';
import { motion } from 'motion/react';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from '../../ErrorPage/Loading';

const RiderDeliveries = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    // Fetch deliveries
    const { data: deliveries = [], isLoading, refetch } = useQuery({
        queryKey: ['rider-assigned-deliveries', user?.uid, filter],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filter !== 'all') params.append('status', filter);

            const res = await axiosSecure.get(`/rider/deliveries/assigned?${params.toString()}`);
            return res.data.data || [];
        },
        enabled: !!user?.uid
    });

    // Accept delivery mutation
    const acceptMutation = useMutation({
        mutationFn: (deliveryId) => axiosSecure.patch(`/rider/deliveries/${deliveryId}/accept`),
        onSuccess: () => {
            refetch();
            Swal.fire({
                icon: 'success',
                title: 'Delivery Accepted!',
                text: 'You can now pick up the parcel',
                timer: 2000
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Accept',
                text: error.response?.data?.message || 'Something went wrong'
            });
        }
    });

    // Start delivery mutation (in transit)
    const startMutation = useMutation({
        mutationFn: (deliveryId) => axiosSecure.patch(`/rider/deliveries/${deliveryId}/start`),
        onSuccess: () => {
            refetch();
            Swal.fire({
                icon: 'success',
                title: 'Delivery Started!',
                text: 'Parcel is now in transit',
                timer: 2000
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Start',
                text: error.response?.data?.message || 'Something went wrong'
            });
        }
    });

    // Out for delivery mutation
    const outForDeliveryMutation = useMutation({
        mutationFn: (deliveryId) => axiosSecure.patch(`/rider/deliveries/${deliveryId}/out-for-delivery`),
        onSuccess: () => {
            refetch();
            Swal.fire({
                icon: 'success',
                title: 'Status Updated!',
                text: 'Parcel is out for delivery',
                timer: 2000
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Update',
                text: error.response?.data?.message || 'Something went wrong'
            });
        }
    });

    // Complete delivery mutation
    const completeMutation = useMutation({
        mutationFn: ({ deliveryId, data }) => axiosSecure.patch(`/rider/deliveries/${deliveryId}/complete`, data),
        onSuccess: () => {
            refetch();
            Swal.fire({
                icon: 'success',
                title: 'Delivery Completed!',
                text: 'Great job! Another delivery done',
                timer: 2000
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Complete',
                text: error.response?.data?.message || 'Something went wrong'
            });
        }
    });

    const handleAccept = (deliveryId) => {
        Swal.fire({
            title: 'Accept Delivery?',
            text: 'Are you ready to pick up this parcel?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Accept'
        }).then((result) => {
            if (result.isConfirmed) {
                acceptMutation.mutate(deliveryId);
            }
        });
    };

    const handleStart = (deliveryId) => {
        Swal.fire({
            title: 'Start Delivery?',
            text: 'Mark this parcel as in transit?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Start'
        }).then((result) => {
            if (result.isConfirmed) {
                startMutation.mutate(deliveryId);
            }
        });
    };

    const handleOutForDelivery = (deliveryId) => {
        Swal.fire({
            title: 'Out for Delivery?',
            text: 'Mark this parcel as out for delivery?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Update'
        }).then((result) => {
            if (result.isConfirmed) {
                outForDeliveryMutation.mutate(deliveryId);
            }
        });
    };

    const handleComplete = (delivery) => {
        Swal.fire({
            title: 'Complete Delivery',
            html: `
                <div class="text-left">
                    <p class="mb-3">Please confirm delivery details:</p>
                    <div class="form-control mb-3">
                        <label class="label">
                            <span class="label-text">Delivered To *</span>
                        </label>
                        <input type="text" id="deliveredTo" class="input input-bordered" 
                               placeholder="Recipient name" value="${delivery.receiverName}" required>
                    </div>
                    <div class="form-control mb-3">
                        <label class="label">
                            <span class="label-text">Delivery Notes (Optional)</span>
                        </label>
                        <textarea id="deliveryNotes" class="textarea textarea-bordered" 
                                  rows="2" placeholder="Any notes about this delivery"></textarea>
                    </div>
                    <div class="form-control">
                        <label class="label cursor-pointer">
                            <span class="label-text">I have taken a delivery photo</span>
                            <input type="checkbox" id="hasPhoto" class="checkbox checkbox-primary" />
                        </label>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Complete Delivery',
            preConfirm: () => {
                const deliveredTo = document.getElementById('deliveredTo').value;
                const deliveryNotes = document.getElementById('deliveryNotes').value;
                const hasPhoto = document.getElementById('hasPhoto').checked;

                if (!deliveredTo) {
                    Swal.showValidationMessage('Recipient name is required');
                    return false;
                }

                return { deliveredTo, deliveryNotes, hasPhotoProof: hasPhoto };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                completeMutation.mutate({
                    deliveryId: delivery._id,
                    data: result.value
                });
            }
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            'assigned': 'badge-primary',
            'picked-up': 'badge-info',
            'in-transit': 'badge-accent',
            'out-for-delivery': 'badge-warning',
            'delivered': 'badge-success'
        };
        return badges[status] || 'badge-ghost';
    };

    const getActionButton = (delivery) => {
        if (delivery.status === 'delivered') {
            return (
                <span className="badge badge-success gap-1">
                    <FaCheckCircle /> Completed
                </span>
            );
        }

        switch (delivery.status) {
            case 'assigned':
                return (
                    <button
                        onClick={() => handleAccept(delivery._id)}
                        className="btn btn-primary btn-sm"
                        disabled={acceptMutation.isPending}
                    >
                        {acceptMutation.isPending ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <>
                                <FaCheck className="mr-1" /> Accept
                            </>
                        )}
                    </button>
                );
            case 'picked-up':
                return (
                    <button
                        onClick={() => handleStart(delivery._id)}
                        className="btn btn-info btn-sm"
                        disabled={startMutation.isPending}
                    >
                        {startMutation.isPending ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <>
                                <FaPlay className="mr-1" /> Start Transit
                            </>
                        )}
                    </button>
                );
            case 'in-transit':
                return (
                    <button
                        onClick={() => handleOutForDelivery(delivery._id)}
                        className="btn btn-warning btn-sm"
                        disabled={outForDeliveryMutation.isPending}
                    >
                        {outForDeliveryMutation.isPending ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <>
                                <FaTruck className="mr-1" /> Out for Delivery
                            </>
                        )}
                    </button>
                );
            case 'out-for-delivery':
                return (
                    <button
                        onClick={() => handleComplete(delivery)}
                        className="btn btn-success btn-sm"
                        disabled={completeMutation.isPending}
                    >
                        {completeMutation.isPending ? (
                            <span className="loading loading-spinner"></span>
                        ) : (
                            <>
                                <FaCheckCircle className="mr-1" /> Complete
                            </>
                        )}
                    </button>
                );
            default:
                return null;
        }
    };

    const filteredDeliveries = deliveries.filter(d =>
        d.parcelName?.toLowerCase().includes(search.toLowerCase()) ||
        d.trackingId?.toLowerCase().includes(search.toLowerCase()) ||
        d.receiverName?.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FaTruck className="text-primary" />
                    My Deliveries
                </h1>
                <button
                    onClick={() => refetch()}
                    className="btn btn-sm btn-outline"
                >
                    🔄 Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <p className="text-sm text-gray-600">Total Assigned</p>
                    <p className="text-2xl font-bold text-gray-900">{deliveries.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {deliveries.filter(d => d.status !== 'delivered').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                        {deliveries.filter(d => d.status === 'delivered').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <p className="text-sm text-gray-600">Today's Earnings</p>
                    <p className="text-2xl font-bold text-blue-600">
                        ৳{deliveries.filter(d => {
                            if (d.status === 'delivered' && d.deliveredAt) {
                                const today = new Date().toDateString();
                                return new Date(d.deliveredAt).toDateString() === today;
                            }
                            return false;
                        }).length * 10}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="md:col-span-2">
                        <label className="label">
                            <span className="label-text flex items-center gap-1">
                                <FaSearch className="text-primary" />
                                Search
                            </span>
                        </label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by parcel name, tracking ID, or receiver..."
                            className="input input-bordered w-full"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="label">
                            <span className="label-text flex items-center gap-1">
                                <FaFilter className="text-primary" />
                                Filter by Status
                            </span>
                        </label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="all">All Deliveries</option>
                            <option value="assigned">Assigned</option>
                            <option value="picked-up">Picked Up</option>
                            <option value="in-transit">In Transit</option>
                            <option value="out-for-delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800">
                    Showing <span className="font-bold">{filteredDeliveries.length}</span> deliveries
                </p>
            </div>

            {/* Deliveries Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredDeliveries.map((delivery) => (
                    <motion.div
                        key={delivery._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden"
                    >
                        {/* Header */}
                        <div className={`p-4 ${delivery.status === 'delivered' ? 'bg-green-50' : 'bg-blue-50'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg">{delivery.parcelName}</h3>
                                    <p className="text-sm text-gray-600 font-mono">#{delivery.trackingId}</p>
                                </div>
                                <span className={`badge ${getStatusBadge(delivery.status)} gap-1`}>
                                    {delivery.status === 'delivered' && <FaCheckCircle />}
                                    {delivery.status === 'assigned' && <FaClock />}
                                    {delivery.status === 'picked-up' && <FaTruck />}
                                    {delivery.status === 'in-transit' && <FaTruck />}
                                    {delivery.status === 'out-for-delivery' && <FaTruck />}
                                    {delivery.status}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <FaUser className="text-primary" />
                                        Receiver
                                    </p>
                                    <p className="font-medium text-sm">{delivery.receiverName}</p>
                                    <p className="text-xs text-gray-600 flex items-center gap-1">
                                        <FaPhone className="text-gray-400" />
                                        {delivery.receiverPhone}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-primary" />
                                        Destination
                                    </p>
                                    <p className="font-medium text-sm">{delivery.receiverDistrict}</p>
                                    <p className="text-xs text-gray-600 truncate">{delivery.receiverAddress}</p>
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="bg-gray-50 p-2 rounded text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Pickup:</span>
                                    <span className="font-medium">{delivery.senderName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Fee:</span>
                                    <span className="font-medium text-green-600">৳{delivery.deliveryFee || 10}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex justify-end">
                                {getActionButton(delivery)}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {delivery.status !== 'delivered' && delivery.status !== 'assigned' && (
                            <div className="h-1 bg-gray-200">
                                <div
                                    className="h-1 bg-primary transition-all duration-500"
                                    style={{
                                        width: delivery.status === 'picked-up' ? '33%' :
                                            delivery.status === 'in-transit' ? '66%' :
                                                delivery.status === 'out-for-delivery' ? '90%' : '0%'
                                    }}
                                />
                            </div>
                        )}
                    </motion.div>
                ))}

                {filteredDeliveries.length === 0 && (
                    <div className="col-span-2 text-center py-12">
                        <FaBox className="text-5xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-500 mb-2">No deliveries found</h3>
                        <p className="text-gray-400">You don't have any deliveries matching your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiderDeliveries;