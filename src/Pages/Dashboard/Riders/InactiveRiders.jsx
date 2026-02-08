import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import useRider from '../../../Hooks/useRider';
import Loading from '../../ErrorPage/Loading';

const InactiveRiders = () => {
    const { useInactiveRiders, updateStatus } = useRider();
    const { data: riders = [], isLoading, refetch } = useInactiveRiders();
    const [selectedRider, setSelectedRider] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleActivate = async (riderId) => {
        if (window.confirm('Are you sure you want to activate this rider?')) {
            try {
                await updateStatus({ riderId, status: 'active' });
                refetch();
            } catch (error) {
                toast.error('Failed to activate rider');
            }
        }
    };

    const handleViewDetails = (rider) => {
        setSelectedRider(rider);
        setShowModal(true);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Inactive Riders</h1>
                <p className="text-gray-600 mt-2">
                    View and manage previously active riders who are currently inactive.
                </p>
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="text-gray-600 mr-3">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-gray-800">
                            <span className="font-semibold">{riders.length}</span> inactive rider(s) - Can be reactivated anytime
                        </p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    SL No.
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rider Details
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact Info
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status & Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {riders.length > 0 ? (
                                riders.map((rider, index) => (
                                    <tr key={rider._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-gray-600 font-bold">{rider.name?.charAt(0) || 'R'}</span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            Inactive
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{rider.email}</div>
                                            <div className="text-sm text-gray-500">{rider.phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{rider.region}</div>
                                            <div className="text-sm text-gray-500">{rider.district}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {rider.activatedAt ? `Was active for ${Math.floor((new Date(rider.updatedAt) - new Date(rider.activatedAt)) / (1000 * 60 * 60 * 24))} days` : 'Never activated'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Last updated: {new Date(rider.updatedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(rider)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    title="View Details"
                                                >
                                                    <span className="mr-1">👁️</span> View
                                                </button>
                                                <button
                                                    onClick={() => handleActivate(rider._id)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                    title="Activate Rider"
                                                >
                                                    <span className="mr-1">✅</span> Activate
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <p className="mt-2 text-lg font-medium">No inactive riders</p>
                                            <p className="mt-1">All riders are currently active or pending.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rider Details Modal (same structure) */}
            {showModal && selectedRider && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Same modal structure with Activate button */}
                </div>
            )}
        </div>
    );
};

export default InactiveRiders;