// src/Pages/Dashboard/RiderDashboard/RiderDashboard.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import {
    FaTruck,
    FaMoneyBill,
    FaCheckCircle,
    FaClock,
    FaBox,
    FaStar,
    FaMotorcycle
} from 'react-icons/fa';
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from '../../ErrorPage/Loading';

const RiderDashboard = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch rider's deliveries
    // Fetch rider's deliveries - using the correct endpoint
    const { data: deliveries = [], isLoading: deliveriesLoading } = useQuery({
        queryKey: ['rider-deliveries', user?.uid],
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/deliveries/assigned?status=all`);
            return res.data.data || [];
        },
        enabled: !!user?.uid
    });

    // Fetch rider's earnings
    const { data: earnings = {}, isLoading: earningsLoading } = useQuery({
        queryKey: ['rider-earnings-summary', user?.uid],
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/earnings/summary?riderId=${user?.uid}`);
            return res.data.data || {};
        },
        enabled: !!user?.uid
    });

    if (deliveriesLoading || earningsLoading) {
        return <Loading />;
    }

    const pendingCount = deliveries.filter(d =>
        ['assigned', 'picked-up', 'in-transit', 'out-for-delivery'].includes(d.status)
    ).length;

    const completedCount = deliveries.filter(d => d.status === 'delivered').length;
    const todayDeliveries = deliveries.filter(d => {
        const today = new Date().toDateString();
        return new Date(d.createdAt).toDateString() === today;
    }).length;

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <FaMotorcycle className="text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Welcome back, {user?.displayName?.split(' ')[0] || 'Rider'}! 🏍️</h1>
                        <p className="opacity-90">You have {pendingCount} Rider deliveries today</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Deliveries</p>
                            <p className="text-2xl font-bold text-gray-900">{deliveries.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <FaBox size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                            <FaClock size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                            <FaCheckCircle size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Today's Earnings</p>
                            <p className="text-2xl font-bold text-purple-600">${earnings.today || 0}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                            <FaMoneyBill size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/dashboard/rider/rider-deliveries" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                            <FaTruck />
                        </div>
                        <div>
                            <h3 className="font-semibold">Rider Deliveries</h3>
                            <p className="text-sm text-gray-500">{pendingCount} deliveries waiting</p>
                        </div>
                    </div>
                </Link>

                <Link to="/dashboard/rider/my-earnings" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <FaMoneyBill />
                        </div>
                        <div>
                            <h3 className="font-semibold">My Earnings</h3>
                            <p className="text-sm text-gray-500">Total: ${earnings.total || 0}</p>
                        </div>
                    </div>
                </Link>

                <Link to="/dashboard/my-application" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                            <FaStar />
                        </div>
                        <div>
                            <h3 className="font-semibold">My Application</h3>
                            <p className="text-sm text-gray-500">View application status</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Recent Deliveries</h2>
                <div className="space-y-3">
                    {deliveries.slice(0, 5).map((delivery) => (
                        <div key={delivery._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">{delivery.parcelName}</p>
                                <p className="text-xs text-gray-500">#{delivery.trackingId}</p>
                            </div>
                            <span className={`badge ${delivery.status === 'delivered' ? 'badge-success' :
                                delivery.status === 'assigned' ? 'badge-primary' :
                                    delivery.status === 'picked-up' ? 'badge-info' :
                                        delivery.status === 'in-transit' ? 'badge-accent' :
                                            'badge-warning'
                                }`}>
                                {delivery.status}
                            </span>
                        </div>
                    ))}
                    {deliveries.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No deliveries yet</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RiderDashboard;