import React, { useState } from 'react';
import useRider from '../../../Hooks/useRider';
import Loading from '../../ErrorPage/Loading';
import { toast } from 'react-hot-toast';

const ActiveRiders = () => {
    const { useActiveRiders, updateStatus } = useRider();
    const { data: riders = [], isLoading, refetch } = useActiveRiders();
    const [selectedRider, setSelectedRider] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleDeactivate = async (riderId) => {
        if (window.confirm('Are you sure you want to deactivate this rider?')) {
            try {
                await updateStatus({ riderId, status: 'inactive' });
                refetch();
            } catch (error) {
                toast.error('Failed to deactivate rider');
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
                <h1 className="text-3xl font-bold text-gray-900">Active Riders</h1>
                <p className="text-gray-600 mt-2">
                    Manage currently active delivery riders. Deactivate riders when needed.
                </p>
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="text-green-600 mr-3">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-green-800">
                            <span className="font-semibold">{riders.length}</span> active rider(s) delivering for Zap-Shift
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
                                                <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-green-600 font-bold">{rider.name?.charAt(0) || 'R'}</span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Active
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
                                                Activated: {rider.activatedAt ? new Date(rider.activatedAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Days active: {rider.activatedAt ?
                                                    Math.floor((new Date() - new Date(rider.activatedAt)) / (1000 * 60 * 60 * 24)) : 0} days
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
                                                    onClick={() => handleDeactivate(rider._id)}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                                    title="Deactivate Rider"
                                                >
                                                    <span className="mr-1">🚫</span> Deactivate
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
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <p className="mt-2 text-lg font-medium">No active riders</p>
                                            <p className="mt-1">Accept pending applications to add active riders.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rider Details Modal (same as pending, but different actions) */}
            {showModal && selectedRider && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Same modal structure as pending page, but with Deactivate button */}
                </div>
            )}
        </div>
    );
};

export default ActiveRiders;