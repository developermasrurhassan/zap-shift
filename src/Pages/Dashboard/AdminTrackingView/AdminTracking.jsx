// src/Pages/Dashboard/AdminTracking/AdminTracking.jsx
import React, { useState } from 'react';
import { Link } from 'react-router';
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
    FaExclamationTriangle
} from 'react-icons/fa';
import useTracking from '../../../Hooks/useTracking';
import Loading from '../../ErrorPage/Loading';


const AdminTracking = () => {
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        district: 'all'
    });

    const { useAdminTrackingList } = useTracking();
    const { data, isLoading, refetch } = useAdminTrackingList(filters);

    const parcels = data?.data || [];
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

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
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
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
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
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
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
                            value={filters.district}
                            onChange={(e) => handleFilterChange('district', e.target.value)}
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
                                            <Link
                                                to={`/dashboard/admin/track/${parcel.trackingId}`}
                                                className="btn btn-xs btn-ghost"
                                                title="View Details"
                                            >
                                                <FaEye className="text-blue-600" />
                                            </Link>
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
        </div>
    );
};

export default AdminTracking;