import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    FaTruck,
    FaBox,
    FaSearch,
    FaFilter,
    FaEye,
    FaMapMarkerAlt,
    FaUser,
    FaCheckCircle,
    FaClock,
    FaSpinner,
    FaExclamationTriangle
} from 'react-icons/fa';

import { motion, AnimatePresence } from 'motion/react';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import Loading from '../../ErrorPage/Loading';

const AdminTracking = () => {
    const axiosSecure = UseAxiosSecure();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [districtFilter, setDistrictFilter] = useState('all');
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch all parcels with tracking info
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-tracking', statusFilter, search, districtFilter],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (search) params.append('search', search);
            if (districtFilter !== 'all') params.append('district', districtFilter);

            const res = await axiosSecure.get(`/admin/tracking?${params.toString()}`);
            return res.data;
        }
    });

    const parcels = data?.data || [];

    // Get unique districts for filter
    const districts = [...new Set(parcels.map(p => p.receiverDistrict).filter(Boolean))].sort();

    const getStatusBadge = (status) => {
        const badges = {
            'pending': 'badge-warning',
            'confirmed': 'badge-info',
            'assigned': 'badge-primary',
            'picked-up': 'badge-secondary',
            'in-transit': 'badge-accent',
            'out-for-delivery': 'badge-info',
            'delivered': 'badge-success',
            'failed': 'badge-error',
            'cancelled': 'badge-ghost'
        };
        return badges[status] || 'badge-ghost';
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
        return <Icon className="text-xs" />;
    };

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FaTruck className="text-primary" />
                    Track All Parcels
                </h1>
                <button
                    onClick={() => refetch()}
                    className="btn btn-sm btn-outline"
                >
                    🔄 Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                            placeholder="Search by Tracking ID, Parcel Name, Receiver..."
                            className="input input-bordered w-full"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="label">
                            <span className="label-text flex items-center gap-1">
                                <FaFilter className="text-primary" />
                                Status
                            </span>
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="assigned">Assigned</option>
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
                        <label className="label">
                            <span className="label-text flex items-center gap-1">
                                <FaMapMarkerAlt className="text-primary" />
                                District
                            </span>
                        </label>
                        <select
                            value={districtFilter}
                            onChange={(e) => setDistrictFilter(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="all">All Districts</option>
                            {districts.map(district => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800">
                    Showing <span className="font-bold">{parcels.length}</span> parcels
                </p>
            </div>

            {/* Parcels Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th>Tracking ID</th>
                                <th>Parcel</th>
                                <th>Receiver</th>
                                <th>District</th>
                                <th>Status</th>
                                <th>Rider</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parcels.length > 0 ? (
                                parcels.map((parcel) => (
                                    <tr key={parcel._id}>
                                        <td>
                                            <span className="font-mono text-sm font-medium">
                                                {parcel.trackingId}
                                            </span>
                                        </td>
                                        <td>
                                            <div>
                                                <p className="font-medium">{parcel.parcelName}</p>
                                                <p className="text-xs text-gray-500">
                                                    ৳{parcel.price}
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <p>{parcel.receiverName}</p>
                                                <p className="text-xs text-gray-500">
                                                    {parcel.receiverPhone}
                                                </p>
                                            </div>
                                        </td>
                                        <td>{parcel.receiverDistrict}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(parcel.status)} gap-1`}>
                                                {getStatusIcon(parcel.status)}
                                                {parcel.status}
                                            </span>
                                        </td>
                                        <td>
                                            {parcel.riderDetails ? (
                                                <div className="text-sm">
                                                    <p className="font-medium">{parcel.riderDetails.name}</p>
                                                    <p className="text-xs text-gray-500">{parcel.riderDetails.phone}</p>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Not assigned</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    setSelectedParcel(parcel);
                                                    setShowModal(true);
                                                }}
                                                className="btn btn-xs btn-ghost"
                                                title="View Details"
                                            >
                                                <FaEye className="text-blue-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                        No parcels found matching your filters
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Parcel Details Modal */}
            <AnimatePresence>
                {showModal && selectedParcel && (
                    <div className="fixed inset-0 z-[9999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <div className="fixed inset-0 bg-black opacity-50"></div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative z-10"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-4 pb-4 border-b">
                                        <div>
                                            <h3 className="text-xl font-bold flex items-center gap-2">
                                                <FaBox className="text-primary" />
                                                Parcel Details
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Tracking ID: {selectedParcel.trackingId}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="text-gray-400 hover:text-gray-600 text-2xl"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4">
                                        {/* Status Timeline */}
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-semibold mb-3">Delivery Timeline</h4>
                                            <div className="space-y-2">
                                                {[
                                                    { status: 'Order Placed', date: selectedParcel.createdAt, completed: true },
                                                    { status: 'Payment Confirmed', date: selectedParcel.paidAt, completed: !!selectedParcel.paidAt },
                                                    { status: 'Assigned to Rider', date: selectedParcel.assignedAt, completed: !!selectedParcel.assignedAt },
                                                    { status: 'Picked Up', date: selectedParcel.pickedUpAt, completed: !!selectedParcel.pickedUpAt },
                                                    { status: 'In Transit', date: selectedParcel.inTransitAt, completed: !!selectedParcel.inTransitAt },
                                                    { status: 'Out for Delivery', date: selectedParcel.outForDeliveryAt, completed: !!selectedParcel.outForDeliveryAt },
                                                    { status: 'Delivered', date: selectedParcel.deliveredAt, completed: !!selectedParcel.deliveredAt }
                                                ].map((step, idx) => (
                                                    <div key={idx} className="flex items-start gap-2">
                                                        <div className={`mt-1 w-4 h-4 rounded-full ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between">
                                                                <span className={`text-sm ${step.completed ? 'font-medium' : 'text-gray-500'}`}>
                                                                    {step.status}
                                                                </span>
                                                                {step.date && (
                                                                    <span className="text-xs text-gray-500">
                                                                        {new Date(step.date).toLocaleString()}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Parcel Info */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Parcel Name</p>
                                                <p className="font-medium">{selectedParcel.parcelName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Type</p>
                                                <p className="font-medium capitalize">{selectedParcel.parcelType}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Weight</p>
                                                <p className="font-medium">{selectedParcel.weight} kg</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Price</p>
                                                <p className="font-medium text-green-600">৳{selectedParcel.price}</p>
                                            </div>
                                        </div>

                                        {/* Sender Info */}
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold mb-2">Sender Details</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">Name</p>
                                                    <p className="font-medium">{selectedParcel.senderName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Phone</p>
                                                    <p className="font-medium">{selectedParcel.senderPhone}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-xs text-gray-500">Address</p>
                                                    <p className="text-sm">{selectedParcel.senderAddress}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Receiver Info */}
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold mb-2">Receiver Details</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">Name</p>
                                                    <p className="font-medium">{selectedParcel.receiverName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Phone</p>
                                                    <p className="font-medium">{selectedParcel.receiverPhone}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-xs text-gray-500">Address</p>
                                                    <p className="text-sm">{selectedParcel.receiverAddress}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rider Info */}
                                        {selectedParcel.riderDetails && (
                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold mb-2">Assigned Rider</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Name</p>
                                                        <p className="font-medium">{selectedParcel.riderDetails.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Phone</p>
                                                        <p className="font-medium">{selectedParcel.riderDetails.phone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Status History */}
                                        {selectedParcel.statusHistory && selectedParcel.statusHistory.length > 0 && (
                                            <div className="border-t pt-4">
                                                <h4 className="font-semibold mb-2">Status History</h4>
                                                <div className="space-y-2">
                                                    {selectedParcel.statusHistory.map((history, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm">
                                                            <span className="capitalize">{history.status}</span>
                                                            <span className="text-gray-500">
                                                                {new Date(history.timestamp).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-6 pt-4 border-t flex justify-end">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="btn btn-primary"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminTracking;