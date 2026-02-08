import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import {
    FaBox,
    FaMoneyBill,
    FaEye,
    FaMapMarkerAlt,
    FaTimes,
    FaCreditCard,
    FaClock,
    FaTrash,
    FaBan
}
    from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { FiCreditCard } from 'react-icons/fi';
import { AiFillCheckCircle } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router';

const MyParcel = () => {
    const { user } = useAuth();
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [processingPayment, setProcessingPayment] = useState(null);

    // ==================== REACT QUERY HOOKS ====================

    const {
        data: parcelsData,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['myParcel', user?.email],
        queryFn: async () => {
            console.log('🔍 [MyParcel] Starting API call for email:', user?.email);

            if (!user?.email) {
                console.log('⚠️ [MyParcel] No user email available');
                return { success: true, data: [], count: 0 };
            }

            try {
                const encodedEmail = encodeURIComponent(user.email);
                const response = await axiosSecure.get(`/parcels?email=${encodedEmail}`, {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`
                    }
                });

                console.log('📦 [MyParcel] API Response:', {
                    success: response.data.success,
                    count: response.data.count,
                    dataLength: response.data.data?.length || 0,
                    queryEmail: response.data.queryEmail,
                    timestamp: response.data.timestamp
                });

                if (response.data.data && response.data.data.length > 0) {
                    console.log('✅ [MyParcel] Parcels found:');
                    response.data.data.forEach((parcel, index) => {
                        console.log(`   ${index + 1}. ${parcel.trackingId} - ${parcel.parcelName} (${parcel.status})`);
                        console.log(`      Payment Status: ${parcel.paymentStatus}`);
                        console.log(`      Amount: ৳${parcel.price}`);
                    });
                } else {
                    console.log('❌ [MyParcel] No parcels found in response');
                }

                return response.data;
            } catch (error) {
                console.error('❌ [MyParcel] API Error:', error);
                return {
                    success: false,
                    data: [],
                    count: 0,
                    error: error.message
                };
            }
        },
        enabled: !!user?.email,
        retry: 1,
        refetchOnWindowFocus: false,
    });

    // Mutation for updating payment status (PAY ON PICKUP)
    const updatePaymentMutation = useMutation({
        mutationFn: async ({ parcelId, email }) => {
            setProcessingPayment(parcelId);
            console.log('💳 [MyParcel] Updating payment for parcel:', parcelId);

            const res = await axiosSecure.patch(`/parcels/${parcelId}/payment`, {
                email: email,
                paymentStatus: 'paid',
                paymentMethod: 'online',
                paidAt: new Date().toISOString()
            });

            console.log('✅ [MyParcel] Payment update response:', res.data);
            return res.data;
        },
        onSuccess: (data) => {
            Swal.fire({
                title: 'Payment Successful!',
                text: 'Your payment has been processed successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            queryClient.invalidateQueries({ queryKey: ['myParcel', user?.email] });
            setProcessingPayment(null);
        },
        onError: (error) => {
            console.error('❌ [MyParcel] Payment error:', error);

            Swal.fire({
                title: 'Payment Failed!',
                text: error.response?.data?.message || 'Failed to process payment. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            setProcessingPayment(null);
        }
    });

    // Mutation for canceling a parcel
    const cancelParcelMutation = useMutation({
        mutationFn: async ({ parcelId, email }) => {
            console.log('❌ [MyParcel] Cancelling parcel:', parcelId);

            const res = await axiosSecure.patch(`/parcels/${parcelId}/cancel`, {
                email: email,
                status: 'cancelled',
                cancelledAt: new Date().toISOString()
            });

            console.log('✅ [MyParcel] Cancel response:', res.data);
            return res.data;
        },
        onSuccess: (data) => {
            Swal.fire({
                title: 'Parcel Cancelled!',
                text: 'Your parcel has been successfully cancelled.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            queryClient.invalidateQueries({ queryKey: ['myParcel', user?.email] });
        },
        onError: (error) => {
            console.error('❌ [MyParcel] Cancel error:', error);
            Swal.fire({
                title: 'Cancellation Failed!',
                text: error.response?.data?.message || 'Failed to cancel parcel. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });

    // Mutation for deleting a cancelled parcel
    const deleteParcelMutation = useMutation({
        mutationFn: async ({ parcelId, email }) => {
            console.log('🗑️ [MyParcel] Deleting parcel:', parcelId);

            const res = await axiosSecure.delete(`/parcels/${parcelId}`, {
                data: { email: email }
            });

            console.log('✅ [MyParcel] Delete response:', res.data);
            return res.data;
        },
        onSuccess: (data) => {
            Swal.fire({
                title: 'Parcel Deleted!',
                text: 'Your parcel has been permanently deleted.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            queryClient.invalidateQueries({ queryKey: ['myParcel', user?.email] });
        },
        onError: (error) => {
            console.error('❌ [MyParcel] Delete error:', error);
            Swal.fire({
                title: 'Deletion Failed!',
                text: error.response?.data?.message || 'Failed to delete parcel. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });

    // ==================== HELPER FUNCTIONS ====================

    const parcels = parcelsData?.data || [];

    useEffect(() => {
        if (parcels.length > 0) {
            console.log('📊 [MyParcel] Current parcels:', parcels.length);
            parcels.forEach(p => {
                console.log(`   📦 ${p.trackingId}: ${p.parcelName} - ${p.status}`);
                console.log(`      Payment: ${p.paymentStatus} - Amount: ৳${p.price}`);
            });
        }
    }, [parcels]);

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'badge badge-warning animate-pulse';
            case 'picked':
                return 'badge badge-info';
            case 'on the way':
                return 'badge badge-primary';
            case 'delivered':
                return 'badge badge-success';
            case 'cancelled':
                return 'badge badge-error';
            case 'paid':
                return 'badge badge-success';
            default:
                return 'badge badge-ghost';
        }
    };

    const getPaymentBadge = (paymentStatus) => {
        switch (paymentStatus?.toLowerCase()) {
            case 'paid':
                return <span className="badge badge-success gap-1"><AiFillCheckCircle /> Paid</span>;
            case 'pending':
                return <span className="badge badge-warning gap-1"><FaClock /> Pending</span>;
            case 'failed':
                return <span className="badge badge-error gap-1"><FaTimes /> Failed</span>;
            default:
                return <span className="badge badge-ghost">Unpaid</span>;
        }
    };

    const canMakePayment = (parcel) => {
        return parcel.paymentStatus === 'pending' && parcel.status !== 'cancelled';
    };

    const canCancelParcel = (parcel) => {
        // Only pending parcels can be cancelled
        return parcel.status === 'pending' && parcel.paymentStatus !== 'paid';
    };

    const canDeleteParcel = (parcel) => {
        // Only cancelled parcels can be deleted
        return parcel.status === 'cancelled';
    };

    // ==================== EVENT HANDLERS ====================

    const handleViewDetails = (parcel) => {
        Swal.fire({
            title: `Parcel Details: ${parcel.parcelName}`,
            html: `
                <div class="text-left space-y-3">
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-base-200 p-3 rounded-lg">
                            <div class="text-xs text-base-content/70">Tracking ID</div>
                            <div class="font-mono font-bold text-primary">${parcel.trackingId}</div>
                        </div>
                        <div class="bg-base-200 p-3 rounded-lg">
                            <div class="text-xs text-base-content/70">Status</div>
                            <div class="font-semibold">
                                <span class="${getStatusBadge(parcel.status)}">${parcel.status}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="font-medium">Parcel Type:</span>
                            <span>${parcel.parcelType}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Weight:</span>
                            <span>${parcel.weight} kg</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Price:</span>
                            <span class="font-bold text-lg text-primary">৳${parcel.price}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Payment Status:</span>
                            <span>${getPaymentBadge(parcel.paymentStatus).props.children}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Pickup Date:</span>
                            <span>${new Date(parcel.deliveryDate).toLocaleDateString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Pickup Time:</span>
                            <span>${parcel.deliveryTime}</span>
                        </div>
                    </div>
                </div>
            `,
            confirmButtonText: 'Close',
            confirmButtonColor: '#3085d6',
            width: '500px'
        });
    };

    const handlePayment = (parcel) => {
        if (!canMakePayment(parcel)) {
            Swal.fire({
                title: 'Cannot Process Payment',
                text: 'Payment is either already completed or parcel is cancelled.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        Swal.fire({
            title: 'Complete Payment',
            html: `
                <div class="text-left">
                    <div class="text-center mb-4">
                        <div class="text-4xl mb-2">💳</div>
                        <h3 class="font-bold text-lg">Payment Required</h3>
                    </div>
                    
                    <div class="bg-base-200 p-4 rounded-lg mb-4">
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="font-medium">Tracking ID:</span>
                                <span class="font-mono font-bold">${parcel.trackingId}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Parcel:</span>
                                <span>${parcel.parcelName}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Weight:</span>
                                <span>${parcel.weight} kg</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Amount:</span>
                                <span class="text-xl font-bold text-primary">৳${parcel.price}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-sm text-base-content/70 mb-4">
                        Choose how you want to proceed with the payment:
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Pay Now',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            showDenyButton: true,
            denyButtonText: 'Pay on Pickup',
            denyButtonColor: '#f59e0b',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirect to payment page
                navigate(`/dashboard/payment/${parcel._id}`, {
                    state: {
                        parcel: parcel,
                        amount: parcel.price,
                        trackingId: parcel.trackingId,
                        email: user?.email
                    }
                });
            } else if (result.isDenied) {
                // Mark as pay on pickup
                updatePaymentMutation.mutate({
                    parcelId: parcel._id,
                    email: user?.email
                });
            }
        });
    };

    const handleCancelParcel = (parcel) => {
        if (!canCancelParcel(parcel)) {
            Swal.fire({
                title: 'Cannot Cancel',
                text: 'This parcel cannot be cancelled. Only pending parcels with unpaid status can be cancelled.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "You want to cancel this parcel delivery?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                cancelParcelMutation.mutate({
                    parcelId: parcel._id,
                    email: user?.email
                });
            }
        });
    };

    const handleDeleteParcel = (parcel) => {
        if (!canDeleteParcel(parcel)) {
            Swal.fire({
                title: 'Cannot Delete',
                text: 'Only cancelled parcels can be permanently deleted.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete the cancelled parcel! This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete permanently!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteParcelMutation.mutate({
                    parcelId: parcel._id,
                    email: user?.email
                });
            }
        });
    };

    // ==================== LOADING AND ERROR STATES ====================

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-primary/30 rounded-full"></div>
                        <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                    <p className="mt-6 text-lg font-medium">Loading your parcels...</p>
                    <p className="text-sm text-gray-500 mt-2">Fetching data for: {user?.email}</p>
                    <button onClick={() => refetch()} className="btn btn-outline btn-primary mt-6">
                        <span className="loading loading-spinner loading-xs mr-2"></span>
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="alert alert-error shadow-lg max-w-md">
                    <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="font-bold">Error loading parcels</h3>
                            <div className="text-xs mt-1">{error.message}</div>
                            <button onClick={() => refetch()} className="btn btn-sm btn-outline mt-3">Retry</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==================== RENDER COMPONENT ====================

    return (
        <div className="p-4 md:p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-linear-to-br from-primary/20 to-primary/10 rounded-2xl">
                            <FaBox className="text-3xl text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-primary">My Parcels</h1>
                            <p className="text-base-content/70">Track and manage all your parcel deliveries</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/send-parcel" className="btn btn-primary text-black gap-2">
                            <FaBox />
                            Send New Parcel
                        </Link>
                    </div>
                </div>

                {/* User Info */}
                <div className="mb-6">
                    <div className="bg-base-200 rounded-xl p-4 inline-block">
                        <p className="text-sm text-base-content/70">
                            <strong>Logged in as:</strong> {user?.email}
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="card bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <div className="card-body p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <FaBox className="text-xl text-primary" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{parcels.length}</div>
                                    <div className="text-sm text-base-content/70">Total Parcels</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-linear-to-br from-warning/10 to-warning/5 border border-warning/20">
                        <div className="card-body p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-warning/20 rounded-lg">
                                    <FaClock className="text-xl text-warning" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {parcels.filter(p => p.paymentStatus === 'pending').length}
                                    </div>
                                    <div className="text-sm text-base-content/70">Pending Payment</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-linear-to-br from-success/10 to-success/5 border border-success/20">
                        <div className="card-body p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-success/20 rounded-lg">
                                    <FaCreditCard className="text-xl text-success" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {parcels.filter(p => p.paymentStatus === 'paid').length}
                                    </div>
                                    <div className="text-sm text-base-content/70">Paid</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-linear-to-br from-error/10 to-error/5 border border-error/20">
                        <div className="card-body p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-error/20 rounded-lg">
                                    <FaBan className="text-xl text-error" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        {parcels.filter(p => p.status === 'cancelled').length}
                                    </div>
                                    <div className="text-sm text-base-content/70">Cancelled</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Parcels Table */}
                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                            <h2 className="card-title text-xl md:text-2xl">Parcel Delivery History</h2>
                            <div className="flex items-center gap-3">
                                <div className="badge text-black badge-lg badge-primary gap-2">
                                    <FaBox /> {parcels.length} parcel{parcels.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>

                        {parcels.length === 0 ? (
                            <div className="text-center py-12 md:py-16">
                                <div className="text-6xl mb-4">📦</div>
                                <h3 className="text-xl md:text-2xl font-semibold mb-3">No Parcels Found</h3>
                                <p className="text-base-content/70 mb-6 max-w-md mx-auto">
                                    You haven't sent any parcels yet. Send your first parcel now!
                                </p>
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-500">
                                        <strong>Email used for query:</strong> {user?.email}
                                    </p>
                                    <Link to="/send-parcel" className="btn btn-primary text-black gap-2">
                                        <FaBox />
                                        Send Your First Parcel
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto rounded-lg">
                                    <table className="table">
                                        <thead>
                                            <tr className="bg-base-200">
                                                <th className="text-base font-semibold text-center">#</th>
                                                <th className="text-base font-semibold">Tracking ID</th>
                                                <th className="text-base font-semibold">Parcel Details</th>
                                                <th className="text-base font-semibold">Receiver</th>
                                                <th className="text-base font-semibold">Amount</th>
                                                <th className="text-base font-semibold">Status</th>
                                                <th className="text-base font-semibold">Payment</th>
                                                <th className="text-base font-semibold">Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {parcels.map((parcel, index) => (
                                                <tr key={parcel._id} className="hover">
                                                    <td className="text-center">
                                                        <div className="font-bold text-primary">
                                                            {index + 1}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="font-mono font-bold text-primary">
                                                            {parcel.trackingId}
                                                        </div>
                                                        <div className="text-xs text-base-content/70">
                                                            {parcel.parcelType}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="font-medium">{parcel.parcelName}</div>
                                                        <div className="text-sm flex items-center gap-1">
                                                            <FaBox className="text-xs" />
                                                            <span>{parcel.weight} kg</span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="font-medium">{parcel.receiverName}</div>
                                                        <div className="text-sm flex items-center gap-1">
                                                            <FaMapMarkerAlt className="text-xs" />
                                                            <span>{parcel.receiverDistrict}</span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="font-bold text-lg">৳{parcel.price}</div>
                                                    </td>

                                                    <td>
                                                        <span className={`${getStatusBadge(parcel.status)}`}>
                                                            {parcel.status}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {getPaymentBadge(parcel.paymentStatus)}
                                                    </td>

                                                    <td>
                                                        <div className="flex flex-wrap gap-2">
                                                            <button
                                                                onClick={() => handleViewDetails(parcel)}
                                                                className="btn btn-sm btn-outline btn-info tooltip"
                                                                data-tip="View Details"
                                                            >
                                                                <FaEye />
                                                            </button>

                                                            {canMakePayment(parcel) ? (
                                                                <button
                                                                    onClick={() => handlePayment(parcel)}
                                                                    disabled={processingPayment === parcel._id}
                                                                    className="btn btn-sm btn-success text-white tooltip"
                                                                    data-tip={`Pay ৳${parcel.price}`}
                                                                >
                                                                    {processingPayment === parcel._id ? (
                                                                        <span className="loading loading-spinner loading-xs"></span>
                                                                    ) : (
                                                                        <FiCreditCard />
                                                                    )}
                                                                </button>
                                                            ) : (
                                                                <div className="tooltip" data-tip={parcel.paymentStatus === 'paid' ? 'Payment Completed' : 'Cannot Process Payment'}>
                                                                    <button
                                                                        className="btn btn-sm btn-outline btn-success"
                                                                        disabled
                                                                    >
                                                                        {parcel.paymentStatus === 'paid' ? (
                                                                            <AiFillCheckCircle />
                                                                        ) : (
                                                                            <FiCreditCard />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {/* Cancel Button for pending parcels */}
                                                            {canCancelParcel(parcel) && (
                                                                <button
                                                                    onClick={() => handleCancelParcel(parcel)}
                                                                    className="btn btn-sm btn-warning text-white tooltip"
                                                                    data-tip="Cancel Delivery"
                                                                >
                                                                    <FaBan />
                                                                </button>
                                                            )}

                                                            {/* Delete Button for cancelled parcels */}
                                                            {canDeleteParcel(parcel) && (
                                                                <button
                                                                    onClick={() => handleDeleteParcel(parcel)}
                                                                    className="btn btn-sm btn-error text-white tooltip"
                                                                    data-tip="Delete Permanently"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards View */}
                                <div className="md:hidden space-y-4">
                                    {parcels.map((parcel, index) => (
                                        <div key={parcel._id} className="card bg-base-200 border border-base-300">
                                            <div className="card-body p-4">
                                                {/* Header */}
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <div className="font-mono font-bold text-primary text-sm">
                                                            {parcel.trackingId}
                                                        </div>
                                                        <div className="text-xs text-base-content/70">
                                                            #{index + 1} • {parcel.parcelType}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`${getStatusBadge(parcel.status)} text-xs`}>
                                                            {parcel.status}
                                                        </div>
                                                        <div className="mt-1">
                                                            {getPaymentBadge(parcel.paymentStatus)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Parcel Info */}
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Parcel:</span>
                                                        <span>{parcel.parcelName}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Receiver:</span>
                                                        <span>{parcel.receiverName}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Amount:</span>
                                                        <span className="font-bold text-primary">৳{parcel.price}</span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="grid grid-cols-4 gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(parcel)}
                                                        className="btn btn-sm btn-outline btn-info"
                                                    >
                                                        <FaEye />
                                                    </button>

                                                    {canMakePayment(parcel) ? (
                                                        <button
                                                            onClick={() => handlePayment(parcel)}
                                                            disabled={processingPayment === parcel._id}
                                                            className="btn btn-sm btn-success"
                                                        >
                                                            {processingPayment === parcel._id ? (
                                                                <span className="loading loading-spinner loading-xs"></span>
                                                            ) : (
                                                                <FiCreditCard />
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            className="btn btn-sm btn-outline btn-success"
                                                        >
                                                            <AiFillCheckCircle />
                                                        </button>
                                                    )}

                                                    {canCancelParcel(parcel) && (
                                                        <button
                                                            onClick={() => handleCancelParcel(parcel)}
                                                            className="btn btn-sm btn-warning text-white"
                                                        >
                                                            <FaBan />
                                                        </button>
                                                    )}

                                                    {canDeleteParcel(parcel) && (
                                                        <button
                                                            onClick={() => handleDeleteParcel(parcel)}
                                                            className="btn btn-sm btn-error text-white"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary Footer */}
                                <div className="mt-6 pt-6 border-t border-base-300">
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="text-sm text-base-content/70">
                                            Showing {parcels.length} parcel{parcels.length !== 1 ? 's' : ''}
                                        </div>
                                        <div className="text-center md:text-right">
                                            <div className="text-lg font-bold">
                                                Total: ৳{parcels.reduce((sum, parcel) => sum + (parcel.price || 0), 0)}
                                            </div>
                                            <div className="text-sm text-base-content/70">
                                                <span className="badge badge-warning mr-2">
                                                    {parcels.filter(p => p.paymentStatus === 'pending').length} pending payment
                                                </span>
                                                <span className="badge badge-success mr-2">
                                                    {parcels.filter(p => p.paymentStatus === 'paid').length} paid
                                                </span>
                                                <span className="badge badge-error mr-2">
                                                    {parcels.filter(p => p.status === 'cancelled').length} cancelled
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyParcel;