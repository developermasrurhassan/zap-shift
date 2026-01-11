import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import {
    FaBox,
    FaTruck,
    FaCalendarAlt,
    FaMoneyBill,
    FaEye,
    FaPrint,
    FaMapMarkerAlt,
    FaTimes,
    FaCreditCard,
    FaCheckCircle,
    FaClock,
    FaReceipt
} from 'react-icons/fa';
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

    // Log user info on component mount
    useEffect(() => {
        console.log('👤 [MyParcel] User info:', {
            email: user?.email,
            uid: user?.uid,
            displayName: user?.displayName
        });
    }, [user]);

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
                // Make the API call
                const response = await axiosSecure.get(`/parcels?email=${user?.email}`);

                console.log('📦 [MyParcel] API Response:', {
                    success: response.data.success,
                    count: response.data.count,
                    dataLength: response.data.data?.length || 0,
                    queryEmail: response.data.queryEmail,
                    timestamp: response.data.timestamp
                });

                // Log each parcel found
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
                throw error;
            }
        },
        enabled: !!user?.email,
        retry: 2,
        refetchOnWindowFocus: true,
    });

    // Mutation for cancelling a parcel
    const cancelParcelMutation = useMutation({
        mutationFn: async (parcelId) => {
            console.log('🔄 [MyParcel] Cancelling parcel:', parcelId);

            const res = await axiosSecure.patch(`/parcels/${parcelId}/cancel`, {
                email: user?.email
            });

            console.log('✅ [MyParcel] Cancel response:', res.data);
            return res.data;
        },
        onSuccess: (data) => {
            Swal.fire({
                title: 'Cancelled!',
                text: data.message || 'Parcel has been cancelled successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            queryClient.invalidateQueries({ queryKey: ['myParcel', user?.email] });
        },
        onError: (error) => {
            console.error('❌ [MyParcel] Cancel error:', error);

            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to cancel parcel. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });

    // Mutation for updating payment status
    const updatePaymentMutation = useMutation({
        mutationFn: async (parcelId) => {
            setProcessingPayment(parcelId);
            console.log('💳 [MyParcel] Updating payment for parcel:', parcelId);

            const res = await axiosSecure.patch(`/parcels/${parcelId}/payment`, {
                email: user?.email,
                paymentStatus: 'paid',
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

    // ==================== HELPER FUNCTIONS ====================

    const parcels = parcelsData?.data || [];

    // Log parcels whenever they change
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

    const canCancelParcel = (parcel) => {
        return ['pending', 'picked'].includes(parcel.status) && parcel.paymentStatus !== 'paid';
    };

    const canMakePayment = (parcel) => {
        return parcel.paymentStatus === 'pending' && parcel.status !== 'cancelled';
    };

    const getCancelReason = (parcel) => {
        if (parcel.status === 'cancelled') return 'Already cancelled';
        if (parcel.status === 'delivered') return 'Already delivered';
        if (parcel.status === 'on the way') return 'Parcel is in transit';
        if (parcel.paymentStatus === 'paid') return 'Payment already made';
        return 'Cannot cancel at this stage';
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
                    
                    <div class="divider my-2"></div>
                    
                    <div class="space-y-2">
                        <div class="font-medium mb-1">Sender Information</div>
                        <div class="text-sm">
                            <div>${parcel.senderName}</div>
                            <div>${parcel.senderEmail}</div>
                            <div>${parcel.senderPhone}</div>
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        <div class="font-medium mb-1">Receiver Information</div>
                        <div class="text-sm">
                            <div>${parcel.receiverName}</div>
                            <div>${parcel.receiverEmail}</div>
                            <div>${parcel.receiverPhone}</div>
                            <div>${parcel.receiverDistrict}</div>
                        </div>
                    </div>
                </div>
            `,
            confirmButtonText: 'Close',
            confirmButtonColor: '#3085d6',
            width: '500px'
        });
    };

    const handlePrintReceipt = (parcel) => {
        if (parcel.paymentStatus !== 'paid') {
            Swal.fire({
                title: 'Payment Required',
                text: 'Please complete payment to generate receipt.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Simulate receipt generation
        Swal.fire({
            title: 'Download Receipt',
            html: `
                <div class="text-center">
                    <div class="text-4xl mb-4">🧾</div>
                    <h3 class="font-bold text-lg mb-2">Receipt Generated</h3>
                    <p class="text-sm mb-4">Your receipt for parcel ${parcel.trackingId} is ready.</p>
                    
                    <div class="bg-base-200 p-4 rounded-lg mb-4 text-left">
                        <div class="flex justify-between mb-2">
                            <span>Tracking ID:</span>
                            <span class="font-mono">${parcel.trackingId}</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span>Amount Paid:</span>
                            <span class="font-bold">৳${parcel.price}</span>
                        </div>
                        <div class="flex justify-between mb-2">
                            <span>Payment Date:</span>
                            <span>${new Date().toLocaleDateString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Payment Method:</span>
                            <span>${parcel.paymentMethod || 'Online'}</span>
                        </div>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Download PDF',
            cancelButtonText: 'Close',
            confirmButtonColor: '#3085d6'
        }).then((result) => {
            if (result.isConfirmed) {
                // In a real app, this would generate and download a PDF
                Swal.fire({
                    title: 'Download Started!',
                    text: 'Receipt PDF is downloading...',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    const handleTrackParcel = (parcel) => {
        Swal.fire({
            title: 'Track Parcel',
            html: `
                <div class="text-center">
                    <div class="text-4xl mb-4">📦</div>
                    <h3 class="font-bold text-lg mb-2">${parcel.trackingId}</h3>
                    
                    <div class="my-6">
                        <div class="radial-progress text-primary" style="--value:70; --size:5rem; --thickness: 0.5rem;">70%</div>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span class="font-medium">Current Status:</span>
                            <span class="${getStatusBadge(parcel.status)}">${parcel.status}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Destination:</span>
                            <span>${parcel.receiverDistrict}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="font-medium">Payment:</span>
                            <span>${getPaymentBadge(parcel.paymentStatus).props.children}</span>
                        </div>
                    </div>
                    
                    <div class="mt-6 p-3 bg-base-200 rounded-lg">
                        <p class="text-sm">Estimated delivery: ${new Date(parcel.deliveryDate).toLocaleDateString()}</p>
                    </div>
                </div>
            `,
            confirmButtonText: 'Close',
            width: '400px'
        });
    };

    const handleCancelParcel = (parcel) => {
        if (!canCancelParcel(parcel)) {
            Swal.fire({
                title: 'Cannot Cancel',
                text: `This parcel cannot be cancelled. ${getCancelReason(parcel)}`,
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        Swal.fire({
            title: 'Cancel Parcel?',
            html: `
                <div class="text-left">
                    <p>Are you sure you want to cancel this parcel?</p>
                    <div class="mt-4 bg-red-50 p-4 rounded-lg">
                        <strong>Parcel Details:</strong>
                        <div class="text-sm mt-2 space-y-1">
                            <div>Tracking ID: <strong>${parcel.trackingId}</strong></div>
                            <div>Parcel: ${parcel.parcelName}</div>
                            <div>To: ${parcel.receiverName} (${parcel.receiverDistrict})</div>
                            <div>Amount: ৳${parcel.price}</div>
                        </div>
                    </div>
                    <p class="text-sm text-red-600 mt-3"><strong>Note:</strong> This action cannot be undone.</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.isConfirmed) {
                cancelParcelMutation.mutate(parcel._id);
            }
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
                navigate(`/payment/${parcel._id}`, {
                    state: {
                        parcel: parcel,
                        amount: parcel.price,
                        trackingId: parcel.trackingId
                    }
                });
            } else if (result.isDenied) {
                // Mark as pay on pickup
                updatePaymentMutation.mutate(parcel._id, {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Payment Scheduled',
                            text: 'Payment will be collected when pickup agent arrives.',
                            icon: 'info',
                            confirmButtonText: 'OK'
                        });
                    }
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
                        <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl">
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
                    <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
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

                    <div className="card bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
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

                    <div className="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
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

                    <div className="card bg-gradient-to-br from-base-200 to-base-100 border border-base-300">
                        <div className="card-body p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-base-300 rounded-lg">
                                    <FaMoneyBill className="text-xl text-base-content" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">
                                        ৳{parcels.reduce((sum, parcel) => sum + (parcel.price || 0), 0)}
                                    </div>
                                    <div className="text-sm text-base-content/70">Total Amount</div>
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
                                <div className="badge badge-lg badge-primary gap-2">
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
                                                    <div className="flex justify-between">
                                                        <span className="font-medium">Pickup:</span>
                                                        <span>{new Date(parcel.deliveryDate).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(parcel)}
                                                        className="btn btn-sm btn-outline btn-info"
                                                    >
                                                        <FaEye />
                                                        Details
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
                                                            Pay ৳{parcel.price}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            className="btn btn-sm btn-outline btn-success"
                                                        >
                                                            <AiFillCheckCircle />
                                                            {parcel.paymentStatus === 'paid' ? 'Paid' : 'Cannot Pay'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto rounded-lg">
                                    <table className="table">
                                        <thead>
                                            <tr className="bg-base-200">
                                                <th className="text-base font-semibold text-center">#</th>
                                                <th className="text-base font-semibold">Tracking ID</th>
                                                <th className="text-base font-semibold">Parcel Details</th>
                                                <th className="text-base font-semibold">Receiver</th>
                                                <th className="text-base font-semibold">Delivery Info</th>
                                                <th className="text-base font-semibold">Status</th>
                                                <th className="text-base font-semibold">Payment</th>
                                                <th className="text-base font-semibold">Amount</th>
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
                                                            {parcel.insurance && (
                                                                <span className="badge badge-xs badge-success ml-2">Insured</span>
                                                            )}
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
                                                        <div className="flex items-center gap-2">
                                                            <FaCalendarAlt className="text-primary" />
                                                            <div>
                                                                <div className="font-medium">
                                                                    {new Date(parcel.deliveryDate).toLocaleDateString()}
                                                                </div>
                                                                <div className="text-sm">{parcel.deliveryTime}</div>
                                                            </div>
                                                        </div>
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
                                                        <div className="font-bold text-lg">৳{parcel.price}</div>
                                                        <div className="text-xs capitalize">
                                                            {parcel.paymentMethod?.replace('_', ' ') || 'cash'}
                                                        </div>
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

                                                            <button
                                                                onClick={() => handleTrackParcel(parcel)}
                                                                className="btn btn-sm btn-outline btn-primary tooltip"
                                                                data-tip="Track"
                                                            >
                                                                <FaTruck />
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

                                                            {parcel.paymentStatus === 'paid' && (
                                                                <button
                                                                    onClick={() => handlePrintReceipt(parcel)}
                                                                    className="btn btn-sm btn-outline btn-secondary tooltip"
                                                                    data-tip="Print Receipt"
                                                                >
                                                                    <FaReceipt />
                                                                </button>
                                                            )}

                                                            {canCancelParcel(parcel) ? (
                                                                <button
                                                                    onClick={() => handleCancelParcel(parcel)}
                                                                    disabled={cancelParcelMutation.isPending}
                                                                    className="btn btn-sm btn-outline btn-error tooltip"
                                                                    data-tip="Cancel Parcel"
                                                                >
                                                                    {cancelParcelMutation.isPending ? (
                                                                        <span className="loading loading-spinner loading-xs"></span>
                                                                    ) : (
                                                                        <FaTimes />
                                                                    )}
                                                                </button>
                                                            ) : (
                                                                <div className="tooltip" data-tip={getCancelReason(parcel)}>
                                                                    <button
                                                                        className="btn btn-sm btn-outline btn-disabled"
                                                                        disabled
                                                                    >
                                                                        <FaTimes />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Status Legend */}
                {parcels.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Status Legend</h3>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <span className="badge badge-warning"></span>
                                <span>Pending - Awaiting pickup</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="badge badge-success"></span>
                                <span>Paid - Payment completed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="badge badge-info"></span>
                                <span>Picked - Collected by delivery agent</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="badge badge-primary"></span>
                                <span>On the way - In transit</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="badge badge-success"></span>
                                <span>Delivered - Successfully delivered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="badge badge-error"></span>
                                <span>Cancelled - Delivery cancelled</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyParcel;