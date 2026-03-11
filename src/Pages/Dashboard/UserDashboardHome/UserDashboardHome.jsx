import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import {
    FaBox,
    FaMotorcycle,
    FaHistory,
    FaUserCheck,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaSpinner,
    FaTruck,
    FaMoneyBillWave
} from 'react-icons/fa';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useUserRole from '../../../Hooks/useUserRole';
import Loading from '../../ErrorPage/Loading';


const UserDashboardHome = () => {
    const { user } = useAuth();
    const { role, isLoading: roleLoading, isRider } = useUserRole(); // Add isRider
    const axiosSecure = useAxiosSecure();

    // Fetch user's parcels
    const { data: parcels = [], isLoading: parcelsLoading } = useQuery({
        queryKey: ['user-parcels', { email: user?.email }],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
            return res.data.data || [];
        },
        enabled: !!user?.email,
        staleTime: 30000,
    });

    // Fetch user's rider application (only if user is a rider)
    const { data: riderApplication, isLoading: riderLoading } = useQuery({
        queryKey: ['my-rider-application', user?.uid],
        queryFn: async () => {
            // FIXED: Use the correct endpoint from useRider hook
            const res = await axiosSecure.get(`/riders/my-application`);
            return res.data?.data || null;
        },
        enabled: !!user?.uid && isRider, // Only fetch if user is a rider
        staleTime: 30000,
    });

    // Fetch user's payment history
    const { data: payments = [], isLoading: paymentsLoading } = useQuery({
        queryKey: ['user-payments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payment-history?email=${user?.email}`);
            return res.data.data || [];
        },
        enabled: !!user?.email,
        staleTime: 30000,
    });

    if (roleLoading || parcelsLoading || (isRider && riderLoading) || paymentsLoading) {
        return <Loading />;
    }

    // Calculate statistics
    const totalParcels = parcels.length;
    const pendingParcels = parcels.filter(p => p.status === 'pending').length;
    const deliveredParcels = parcels.filter(p => p.status === 'delivered').length;
    const cancelledParcels = parcels.filter(p => p.status === 'cancelled').length;

    const totalSpent = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const recentParcels = [...parcels]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaClock, label: 'Pending' },
            processing: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FaSpinner, label: 'Processing' },
            picked: { bg: 'bg-purple-100', text: 'text-purple-800', icon: FaTruck, label: 'Picked Up' },
            delivered: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle, label: 'Delivered' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: FaTimesCircle, label: 'Cancelled' },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <Icon className="text-xs" />
                {config.label}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-linear-to-r from-primary/10 to-secondary/10 rounded-xl p-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.displayName || 'User'}! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                    {role === 'admin' && "Manage the system from your admin dashboard"}
                    {role === 'rider' && "Track your deliveries and earnings"}
                    {role === 'user' && "Manage your parcels and track shipments"}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Parcels */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Parcels</p>
                            <p className="text-2xl font-bold text-gray-900">{totalParcels}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-2xl">
                            <FaBox />
                        </div>
                    </div>
                </div>

                {/* Pending Parcels */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{pendingParcels}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 text-2xl">
                            <FaClock />
                        </div>
                    </div>
                </div>

                {/* Delivered Parcels */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Delivered</p>
                            <p className="text-2xl font-bold text-green-600">{deliveredParcels}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-2xl">
                            <FaCheckCircle />
                        </div>
                    </div>
                </div>

                {/* Total Spent */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Spent</p>
                            <p className="text-2xl font-bold text-purple-600">${totalSpent.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD"
                            })}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-2xl">
                            <FaMoneyBillWave />
                        </div>
                    </div>
                </div>
            </div>

            {/* Role-specific Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Recent Parcels */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Parcels */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <FaBox className="text-primary" />
                                Recent Parcels
                            </h2>
                            <Link to="/dashboard/my-parcel" className="text-sm text-primary hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table table-xs w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2">Tracking ID</th>
                                        <th className="px-4 py-2">Parcel Name</th>
                                        <th className="px-4 py-2 hidden sm:table-cell">Date</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Price</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentParcels.length > 0 ? (
                                        recentParcels.map((parcel) => (
                                            <tr key={parcel._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 font-mono text-xs">
                                                    {parcel.trackingId ? parcel.trackingId.slice(-8) : "N/A"}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div>
                                                        <p className="font-medium text-sm">{parcel.parcelName}</p>
                                                        <p className="text-xs text-gray-500 sm:hidden">
                                                            {parcel.createdAt
                                                                ? new Date(parcel.createdAt).toLocaleDateString()
                                                                : "N/A"}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-xs hidden sm:table-cell">
                                                    {new Date(parcel.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <StatusBadge status={parcel.status} />
                                                </td>
                                                <td className="px-4 py-2 text-xs font-medium">
                                                    ${parcel.price || 0}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <Link
                                                        to={`/track/${parcel.trackingId}`}
                                                        target="_blank"
                                                        className="btn btn-xs btn-info"
                                                        title="Track Parcel"
                                                    >
                                                        <FaTruck className="mr-1" /> Track
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                                No parcels found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Rider Application Status - Only for riders */}
                    {role === 'rider' && riderApplication && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                <FaMotorcycle className="text-primary" />
                                Rider Application Status
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${riderApplication.status === 'active' ? 'bg-green-100 text-green-600' :
                                    riderApplication.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                    {riderApplication.status === 'active' && <FaCheckCircle />}
                                    {riderApplication.status === 'pending' && <FaClock />}
                                    {riderApplication.status === 'inactive' && <FaTimesCircle />}
                                </div>
                                <div>
                                    <p className="font-semibold">
                                        Status: <span className={`capitalize ${riderApplication.status === 'active' ? 'text-green-600' :
                                            riderApplication.status === 'pending' ? 'text-yellow-600' :
                                                'text-gray-600'
                                            }`}>{riderApplication.status}</span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Applied on: {riderApplication?.appliedAt
                                            ? new Date(riderApplication.appliedAt).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                    <Link to="/dashboard/my-application" className="text-sm text-primary hover:underline mt-1 inline-block">
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Quick Actions & Stats */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                to="/send-parcel"
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors"
                            >
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                    <FaBox />
                                </div>
                                <div>
                                    <p className="font-medium">Send a Parcel</p>
                                    <p className="text-xs text-gray-500">Create new delivery</p>
                                </div>
                            </Link>

                            <Link
                                to="/dashboard/payment-history"
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors"
                            >
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                    <FaHistory />
                                </div>
                                <div>
                                    <p className="font-medium">Payment History</p>
                                    <p className="text-xs text-gray-500">View all transactions</p>
                                </div>
                            </Link>

                            {role !== 'rider' && role !== 'admin' && (
                                <Link
                                    to="/become-rider"
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                        <FaMotorcycle />
                                    </div>
                                    <div>
                                        <p className="font-medium">Become a Rider</p>
                                        <p className="text-xs text-gray-500">Join our delivery team</p>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Recent Payments */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
                        {payments.length > 0 ? (
                            <div className="space-y-3">
                                {payments.slice(0, 3).map((payment) => (
                                    <div key={payment._id} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium">${payment.amount}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(payment.transactionDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className="badge badge-success badge-sm">Paid</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">No payments yet</p>
                        )}
                    </div>

                    {/* Account Info */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-4">Account Info</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Member Since</p>
                                <p className="text-sm font-medium">
                                    {user?.metadata?.creationTime
                                        ? new Date(user.metadata.creationTime).toLocaleDateString()
                                        : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Account Type</p>
                                <span className={`badge ${role === 'admin' ? 'badge-primary' :
                                    role === 'rider' ? 'badge-success' :
                                        'badge-ghost'
                                    }`}>
                                    {role || 'user'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboardHome;