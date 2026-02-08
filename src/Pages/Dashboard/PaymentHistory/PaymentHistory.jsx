import { useQuery } from '@tanstack/react-query';

import { FaReceipt, FaCreditCard, FaCalendar, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import useAuth from '../../../Hooks/useAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { InlineLoading } from '../../ErrorPage/Loading';
import Swal from 'sweetalert2';

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = UseAxiosSecure();

    const { data: paymentHistory, isLoading, error, refetch } = useQuery({
        queryKey: ['paymentHistory', user?.email],
        queryFn: async () => {
            console.log('📋 Fetching payment history for:', user?.email);

            const response = await axiosSecure.get(`/payment-history?email=${encodeURIComponent(user.email)}`);

            console.log('📊 Payment history response:', {
                success: response.data.success,
                count: response.data.count,
                data: response.data.data
            });

            return response.data;
        },
        enabled: !!user?.email,
        retry: 1,
        refetchOnWindowFocus: false
    });

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'success':
                return <FaCheckCircle className="text-green-500" />;
            case 'failed':
                return <FaTimesCircle className="text-red-500" />;
            case 'pending':
                return <FaSpinner className="text-yellow-500 animate-spin" />;
            default:
                return <MdPayment className="text-gray-500" />;
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'success':
                return 'badge badge-success';
            case 'failed':
                return 'badge badge-error';
            case 'pending':
                return 'badge badge-warning';
            default:
                return 'badge badge-ghost';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPaymentMethod = (method) => {
        switch (method?.toLowerCase()) {
            case 'card':
                return 'Credit/Debit Card';
            case 'cash':
                return 'Cash on Delivery';
            case 'pay_on_pickup':
                return 'Pay on Pickup';
            default:
                return method || 'Unknown';
        }
    };

    if (isLoading) {
        return <InlineLoading />;
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="alert alert-error shadow-lg max-w-md">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="font-bold">Error loading payment history</h3>
                            <div className="text-xs">{error.message}</div>
                            <button onClick={() => refetch()} className="btn btn-sm btn-outline mt-3">Retry</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const payments = paymentHistory?.data || [];

    return (
        <div className="p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-linear-to-br from-blue-500/20 to-blue-600/10 rounded-2xl">
                        <FaReceipt className="text-3xl text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Payment History</h1>
                        <p className="text-gray-600">Track all your payment transactions</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="card bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200">
                        <div className="card-body p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-blue-700">
                                        {payments.length}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Payments</div>
                                </div>
                                <FaReceipt className="text-2xl text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-linear-to-br from-green-50 to-green-100 border border-green-200">
                        <div className="card-body p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-green-700">
                                        {payments.filter(p => p.status === 'success').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Successful</div>
                                </div>
                                <FaCheckCircle className="text-2xl text-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="card bg-linear-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
                        <div className="card-body p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-yellow-700">
                                        ৳{payments.reduce((sum, p) => sum + (p.amount || 0), 0)}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Spent</div>
                                </div>
                                <FaCreditCard className="text-2xl text-yellow-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment History Table */}
                <div className="card bg-white shadow-xl border border-gray-200">
                    <div className="card-body p-4 md:p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="card-title text-xl">Recent Transactions</h2>
                            <div className="badge badge-lg badge-primary">
                                Latest First
                            </div>
                        </div>

                        {payments.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">💳</div>
                                <h3 className="text-xl font-semibold mb-3">No Payment History</h3>
                                <p className="text-gray-500 mb-6">
                                    You haven't made any payments yet.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="font-semibold">Date & Time</th>
                                            <th className="font-semibold">Transaction Details</th>
                                            <th className="font-semibold">Amount</th>
                                            <th className="font-semibold">Method</th>
                                            <th className="font-semibold">Status</th>
                                            <th className="font-semibold">Receipt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((payment) => (
                                            <tr key={payment._id} className="hover">
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <FaCalendar className="text-gray-400" />
                                                        <div>
                                                            <div className="font-medium">
                                                                {formatDate(payment.transactionDate)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <div className="font-semibold">
                                                            {payment.parcelDetails?.parcelName || 'Parcel Payment'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {payment.trackingId && (
                                                                <>Tracking: <span className="font-mono">{payment.trackingId}</span></>
                                                            )}
                                                        </div>
                                                        {payment.stripePaymentId && (
                                                            <div className="text-xs text-gray-400 mt-1">
                                                                ID: {payment.stripePaymentId.slice(-8)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-lg font-bold text-green-600">
                                                        ৳{payment.amount}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <FaCreditCard className="text-blue-500" />
                                                        <span>{formatPaymentMethod(payment.paymentMethod)}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(payment.status)}
                                                        <span className={`${getStatusBadge(payment.status)}`}>
                                                            {payment.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        onClick={() => {
                                                            // You can add a receipt view modal here
                                                            Swal.fire({
                                                                title: 'Payment Receipt',


                                                                html: `
            <div class="receipt-container">
                <div class="receipt-header">
                    <h3 class="text-xl font-bold">ZAP SHIFT</h3>
                    <p class="text-gray-600">Delivery Service</p>
                </div>
                
                <div class="receipt-body">
                    <div class="receipt-row">
                        <span>Transaction ID:</span>
                        <strong>${payment.stripePaymentId?.slice(-12)}</strong>
                    </div>
                    <div class="receipt-row">
                        <span>Date:</span>
                        <span>${formatDate(payment.transactionDate)}</span>
                    </div>
                    <div class="receipt-row">
                        <span>Status:</span>
                        <span class="badge ${getStatusBadge(payment.status)}">${payment.status}</span>
                    </div>
                    <hr class="my-4" />
                    <div class="receipt-row">
                        <span>Amount:</span>
                        <span class="text-2xl font-bold text-green-600">৳${payment.amount}</span>
                    </div>
                    <div class="receipt-row">
                        <span>Payment Method:</span>
                        <span>${formatPaymentMethod(payment.paymentMethod)}</span>
                    </div>
                    ${payment.parcelDetails ? `
                        <hr class="my-4" />
                        <div class="receipt-row">
                            <span>Parcel:</span>
                            <span>${payment.parcelDetails.parcelName}</span>
                        </div>
                        <div class="receipt-row">
                            <span>Tracking ID:</span>
                            <span class="font-mono">${payment.trackingId}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `
                                                                ,

                                                                width: '500px',
                                                                showConfirmButton: false,
                                                                showCloseButton: true,
                                                                customClass: {
                                                                    popup: 'rounded-xl',
                                                                    htmlContainer: '!text-left'
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Summary */}
                        {payments.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">
                                        Showing {payments.length} transaction{payments.length !== 1 ? 's' : ''}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold">
                                            Total: ৳{payments.reduce((sum, p) => sum + (p.amount || 0), 0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentHistory;