import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router';
import {
    FaTruck,
    FaBox,
    FaMapMarkerAlt,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaCheckCircle,
    FaClock,
    FaSpinner,
    FaExclamationTriangle,
    FaHome,
    FaSearch
} from 'react-icons/fa';
import { motion } from 'motion/react';
import UseAxios from '../../Hooks/UseAxios';
import Loading from '../ErrorPage/Loading';


const TrackParcel = () => {
    const { trackingId } = useParams();
    const axios = UseAxios();
    const [searchId, setSearchId] = useState(trackingId || '');

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['track-parcel', trackingId],
        queryFn: async () => {
            if (!trackingId) return null;
            const res = await axios.get(`/track/${trackingId}`);
            return res.data.data;
        },
        enabled: !!trackingId,
        staleTime: 30000,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchId.trim()) {
            window.location.href = `/track/${searchId.trim()}`;
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
            'assigned': 'bg-purple-100 text-purple-800 border-purple-200',
            'picked-up': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'in-transit': 'bg-orange-100 text-orange-800 border-orange-200',
            'out-for-delivery': 'bg-blue-100 text-blue-800 border-blue-200',
            'delivered': 'bg-green-100 text-green-800 border-green-200',
            'failed': 'bg-red-100 text-red-800 border-red-200',
            'cancelled': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusIcon = (status) => {
        const icons = {
            'pending': FaClock,
            'confirmed': FaCheckCircle,
            'assigned': FaUser,
            'picked-up': FaTruck,
            'in-transit': FaTruck,
            'out-for-delivery': FaTruck,
            'delivered': FaCheckCircle,
            'failed': FaExclamationTriangle,
            'cancelled': FaExclamationTriangle
        };
        const Icon = icons[status] || FaBox;
        return <Icon className="text-lg" />;
    };

    if (isLoading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-4">
                        <img src="/logo.png" alt="ZapShift" className="h-12 mx-auto" />
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Track Your Parcel
                    </h1>
                    <p className="text-gray-600">
                        Enter your tracking number to get real-time updates
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                                placeholder="Enter tracking ID (e.g., TRK12345678)"
                                className="input input-bordered w-full pl-10"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={!searchId.trim()}
                        >
                            Track Parcel
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="alert alert-error shadow-lg">
                        <FaExclamationTriangle />
                        <span>Error: {error.message}</span>
                    </div>
                )}

                {!trackingId && !data && (
                    <div className="text-center py-12">
                        <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-600 mb-2">
                            Enter a Tracking ID to Begin
                        </h2>
                        <p className="text-gray-500">
                            Your tracking ID can be found in your email or dashboard
                        </p>
                    </div>
                )}

                {data && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Status Banner */}
                        <div className={`rounded-xl p-6 border-2 ${getStatusColor(data.status)}`}>
                            <div className="flex items-center gap-4">
                                <div className="text-4xl">
                                    {getStatusIcon(data.status)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">
                                        {data.parcelName}
                                    </h2>
                                    <p className="text-lg opacity-90">
                                        Status: {data.status.replace('-', ' ').toUpperCase()}
                                    </p>
                                    <p className="text-sm opacity-75 mt-1">
                                        Tracking ID: {data.trackingId}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Timeline */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Delivery Progress</h3>
                            <div className="space-y-4">
                                {data.timeline.map((step, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.completed
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {step.completed ? (
                                                <FaCheckCircle className="text-sm" />
                                            ) : (
                                                <FaClock className="text-sm" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <span className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'
                                                    }`}>
                                                    {step.status}
                                                </span>
                                                {step.date && (
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(step.date).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Parcel Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sender Info */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <FaUser className="text-primary" />
                                    Sender Details
                                </h3>
                                <div className="space-y-3">
                                    <p className="font-medium">{data.senderName}</p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        {data.senderAddress}
                                    </p>
                                </div>
                            </div>

                            {/* Receiver Info */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <FaUser className="text-primary" />
                                    Receiver Details
                                </h3>
                                <div className="space-y-3">
                                    <p className="font-medium">{data.receiverName}</p>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-gray-400" />
                                        {data.receiverAddress}, {data.receiverDistrict}
                                    </p>
                                </div>
                            </div>

                            {/* Current Location */}
                            {data.currentLocation && (
                                <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-primary" />
                                        Current Location
                                    </h3>
                                    <p className="font-medium">{data.currentLocation}</p>
                                    {data.estimatedDelivery && (
                                        <p className="text-sm text-gray-600 mt-2">
                                            Estimated Delivery: {new Date(data.estimatedDelivery).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Full Status History */}
                        {data.statusHistory && data.statusHistory.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold mb-4">Status History</h3>
                                <div className="space-y-3">
                                    {data.statusHistory.map((history, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                                            <div>
                                                <span className="font-medium capitalize">
                                                    {history.status.replace('-', ' ')}
                                                </span>
                                                {history.note && (
                                                    <p className="text-sm text-gray-600">{history.note}</p>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(history.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => window.print()}
                                className="btn btn-outline"
                            >
                                Print Details
                            </button>
                            <Link to="/" className="btn btn-primary">
                                <FaHome className="mr-2" />
                                Back to Home
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TrackParcel;