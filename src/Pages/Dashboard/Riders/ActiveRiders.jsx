import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import useRider from '../../../Hooks/useRider';
import Loading from '../../ErrorPage/Loading';
import { FaEye, FaToggleOn, FaMotorcycle, FaUserCheck } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { RiUserLocationLine } from 'react-icons/ri';
import { BiTime } from 'react-icons/bi';

const ActiveRiders = () => {
    const { useAllActiveRiders, updateStatus } = useRider();
    const { data: riders = [], isLoading, refetch, error } = useAllActiveRiders();
    const [selectedRider, setSelectedRider] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState('all');

    const getSortedRiders = () => {
        if (!riders.length) return [];

        const sorted = [...riders];
        if (filter === 'recent') {
            return sorted.sort((a, b) => new Date(b.activatedAt || b.appliedAt) - new Date(a.activatedAt || a.appliedAt));
        } else if (filter === 'oldest') {
            return sorted.sort((a, b) => new Date(a.activatedAt || a.appliedAt) - new Date(b.activatedAt || b.appliedAt));
        }
        return sorted;
    };

    const handleDeactivate = async (riderId, riderName) => {
        try {
            const result = await Swal.fire({
                title: 'Deactivate Rider?',
                html: `<p class="text-gray-600">Are you sure you want to deactivate <span class="font-semibold">${riderName}</span>?</p>
               <p class="text-sm text-gray-500 mt-2">They will be moved to inactive riders.</p>`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#f97316',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Yes, deactivate',
                cancelButtonText: 'Cancel',
                background: '#fff',
                backdrop: 'rgba(0,0,0,0.4)'
            });

            if (result.isConfirmed) {
                await updateStatus({ riderId, status: 'inactive' });

                await Swal.fire({
                    title: 'Deactivated!',
                    text: 'Rider has been moved to inactive list.',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                    timer: 2000,
                    timerProgressBar: true
                });

                toast.success('Rider deactivated successfully');
            }
        } catch (error) {
            toast.error('Failed to deactivate rider');
            console.error('Deactivate error:', error);
        }
    };

    const handleViewDetails = (rider) => {
        setSelectedRider(rider);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRider(null);
    };

    const getActiveDuration = (activatedAt) => {
        if (!activatedAt) return 'N/A';
        const start = new Date(activatedAt);
        const now = new Date();
        const days = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return '1 day';
        return `${days} days`;
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">Error loading active riders: {error.message}</p>
                    <button onClick={() => refetch()} className="mt-2 btn btn-sm btn-outline">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const sortedRiders = getSortedRiders();

    return (
        <div className="dashboard-content w-full">
            <div className="p-4 md:p-6">
                {/* Header Section */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <FaUserCheck className="text-green-600" />
                            Active Riders
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm md:text-base">
                            Manage your currently active delivery riders
                        </p>
                    </div>

                    {/* Stats and Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 flex items-center">
                            <FaMotorcycle className="text-green-600 text-xl mr-2" />
                            <div>
                                <p className="text-xs text-gray-600">Total Active</p>
                                <p className="text-2xl font-bold text-green-700">{riders.length}</p>
                            </div>
                        </div>

                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="select select-bordered select-sm bg-white w-full sm:w-auto"
                        >
                            <option value="all">All Riders</option>
                            <option value="recent">Recently Active</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rider</th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                    <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                    <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active Since</th>
                                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedRiders.length > 0 ? (
                                    sortedRiders.map((rider, index) => (
                                        <tr key={rider._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                                                        <span className="text-green-700 font-bold text-sm">
                                                            {rider.name?.charAt(0) || 'R'}
                                                        </span>
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-semibold text-gray-900">{rider.name}</div>
                                                        <div className="md:hidden text-xs text-gray-500 flex items-center">
                                                            <RiUserLocationLine className="mr-1" /> {rider.region}
                                                        </div>
                                                        <div className="md:hidden text-xs text-gray-500">
                                                            Active: {getActiveDuration(rider.activatedAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="text-sm text-gray-900">{rider.email}</div>
                                                <div className="text-xs text-gray-500">{rider.phone || 'No phone'}</div>
                                            </td>
                                            <td className="hidden md:table-cell px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{rider.region}</div>
                                                <div className="text-xs text-gray-500">{rider.district}</div>
                                            </td>
                                            <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {rider.activatedAt
                                                        ? new Date(rider.activatedAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })
                                                        : new Date(rider.appliedAt).toLocaleDateString()
                                                    }
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    <BiTime className="mr-1" />
                                                    {getActiveDuration(rider.activatedAt)}
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(rider)}
                                                        className="btn btn-xs btn-ghost tooltip"
                                                        data-tip="View Details"
                                                        title="View Details"
                                                    >
                                                        <FaEye className="text-blue-600 text-base" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeactivate(rider._id, rider.name)}
                                                        className="btn btn-xs btn-warning text-white tooltip"
                                                        data-tip="Deactivate"
                                                        title="Deactivate Rider"
                                                    >
                                                        <FaToggleOn className="text-base" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <div className="text-6xl mb-4 flex justify-center">
                                                    <FaMotorcycle className="text-gray-300" />
                                                </div>
                                                <p className="text-xl font-medium text-gray-700 mb-2">No Active Riders</p>
                                                <p className="text-sm text-gray-500 mb-4">
                                                    There are no active riders at the moment.
                                                </p>
                                                <button
                                                    onClick={() => window.location.href = '/dashboard/rider/pending'}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    View Pending Applications
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Stats Row */}
                {riders.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                            <p className="text-sm text-gray-600">Total Active Riders</p>
                            <p className="text-2xl font-bold text-gray-900">{riders.length}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                            <p className="text-sm text-gray-600">Unique Regions</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {new Set(riders.map(r => r.region)).size}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                            <p className="text-sm text-gray-600">Most Active Brand</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {Object.entries(
                                    riders.reduce((acc, r) => {
                                        acc[r.bikeBrand] = (acc[r.bikeBrand] || 0) + 1;
                                        return acc;
                                    }, {})
                                ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Rider Details Modal */}
                {showModal && selectedRider && (
                    <div className="fixed inset-0 z-[9999] overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            {/* Background overlay */}
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>

                            {/* Modal panel */}
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full relative z-[10000]">
                                <div className="bg-white px-6 pt-6 pb-4 sm:p-8">
                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-4 pb-4 border-b">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                <FaUserCheck className="text-green-600" />
                                                Active Rider Details
                                            </h3>
                                            <p className="text-gray-600 text-xs mt-1">ID: {selectedRider._id?.slice(-8)}</p>
                                        </div>
                                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">
                                            ×
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                        {/* Status Badge */}
                                        <div className="bg-green-50 p-3 rounded-lg flex items-center justify-between">
                                            <span className="text-green-800 font-medium">Current Status</span>
                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                                ✅ Active
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Name</p>
                                                <p className="text-sm font-medium">{selectedRider.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-sm">{selectedRider.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Phone</p>
                                                <p className="text-sm">{selectedRider.phone || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Active Since</p>
                                                <p className="text-sm">
                                                    {selectedRider.activatedAt
                                                        ? new Date(selectedRider.activatedAt).toLocaleDateString()
                                                        : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <h4 className="font-medium text-sm mb-2">Documents</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-500">License</p>
                                                    <p>{selectedRider.drivingLicense}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">NID</p>
                                                    <p>{selectedRider.nid}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <h4 className="font-medium text-sm mb-2">Location</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-500">Region</p>
                                                    <p>{selectedRider.region}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">District</p>
                                                    <p>{selectedRider.district}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4">
                                            <h4 className="font-medium text-sm mb-2">Bike</h4>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-500">Brand</p>
                                                    <p>{selectedRider.bikeBrand}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Model</p>
                                                    <p>{selectedRider.bikeModel}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Reg No.</p>
                                                    <p className="text-xs">{selectedRider.bikeRegistration}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row gap-3 justify-end">
                                        <button onClick={closeModal} className="btn btn-outline btn-sm">
                                            Close
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDeactivate(selectedRider._id, selectedRider.name);
                                                closeModal();
                                            }}
                                            className="btn btn-warning btn-sm text-white"
                                        >
                                            <FaToggleOn className="mr-1" /> Deactivate Rider
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveRiders;