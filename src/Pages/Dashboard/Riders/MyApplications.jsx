import React, { useState } from 'react';
import { Link } from 'react-router';
import useRider from '../../../Hooks/useRider';
import Loading from '../../ErrorPage/Loading';

const MyApplication = () => {
    // FIXED: useMyRiderApplication, not useMyApplication
    const { useMyRiderApplication } = useRider();
    const { data: application, isLoading, error, refetch } = useMyRiderApplication();

    const [showDetails, setShowDetails] = useState(false);

    // Add refresh button
    const handleRefresh = () => {
        refetch();
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">Error loading application: {error.message}</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-2 btn btn-sm btn-outline"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            {/* Header with Refresh */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Rider Application</h1>
                    <p className="text-gray-600 mt-1 text-sm md:text-base">
                        Track the status of your rider application
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="btn btn-sm btn-outline"
                    title="Refresh"
                >
                    🔄 Refresh
                </button>
            </div>

            {!application ? (
                // No application found
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center">
                    <div className="text-gray-400 text-5xl md:text-6xl mb-4">📋</div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">No Application Found</h2>
                    <p className="text-gray-500 mb-6">You haven't submitted a rider application yet.</p>
                    <Link to="/become-rider" className="btn btn-primary">
                        Apply to Become a Rider
                    </Link>
                </div>
            ) : (
                // Application found
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Status Banner */}
                    <div className={`p-4 md:p-6 ${application.status === 'pending' ? 'bg-yellow-50 border-b border-yellow-200' :
                            application.status === 'active' ? 'bg-green-50 border-b border-green-200' :
                                'bg-gray-50 border-b border-gray-200'
                        }`}>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className={`flex items-center ${application.status === 'pending' ? 'text-yellow-600' :
                                    application.status === 'active' ? 'text-green-600' :
                                        'text-gray-600'
                                }`}>
                                <span className="text-3xl mr-3">
                                    {application.status === 'pending' && '⏳'}
                                    {application.status === 'active' && '✅'}
                                    {application.status === 'inactive' && '⏸️'}
                                </span>
                                <div>
                                    <h2 className={`text-lg md:text-xl font-semibold ${application.status === 'pending' ? 'text-yellow-800' :
                                            application.status === 'active' ? 'text-green-800' :
                                                'text-gray-800'
                                        }`}>
                                        Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                    </h2>
                                    <p className={
                                        application.status === 'pending' ? 'text-yellow-700' :
                                            application.status === 'active' ? 'text-green-700' :
                                                'text-gray-700'
                                    }>
                                        {application.status === 'pending' && 'Your application is being reviewed'}
                                        {application.status === 'active' && 'You are now an active rider'}
                                        {application.status === 'inactive' && 'Your account is inactive'}
                                    </p>
                                </div>
                            </div>
                            <div className="md:ml-auto">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        application.status === 'active' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {application.status === 'pending' && '⏳ Pending Review'}
                                    {application.status === 'active' && '✅ Active'}
                                    {application.status === 'inactive' && '⏸️ Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Application Summary */}
                    <div className="p-4 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                                    <span className="mr-2 text-xl">👤</span> Personal
                                </h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="text-gray-500">Name:</span> {application.name}</p>
                                    <p><span className="text-gray-500">Email:</span> {application.email}</p>
                                    <p><span className="text-gray-500">Phone:</span> {application.phone || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                                    <span className="mr-2 text-xl">📄</span> Documents
                                </h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="text-gray-500">NID:</span> {application.nid}</p>
                                    <p><span className="text-gray-500">License:</span> {application.drivingLicense}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                                    <span className="mr-2 text-xl">📍</span> Location
                                </h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="text-gray-500">Region:</span> {application.region}</p>
                                    <p><span className="text-gray-500">District:</span> {application.district}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                                    <span className="mr-2 text-xl">🏍️</span> Bike
                                </h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="text-gray-500">Brand:</span> {application.bikeBrand}</p>
                                    <p><span className="text-gray-500">Model:</span> {application.bikeModel}</p>
                                    <p><span className="text-gray-500">Reg:</span> {application.bikeRegistration}</p>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="mt-4 md:mt-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                                    <span className="mr-2 text-xl">💬</span> About
                                </h3>
                                <p className="text-gray-800 whitespace-pre-wrap text-sm">{application.about}</p>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="mt-4 md:mt-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                                    <span className="mr-2 text-xl">⏰</span> Timeline
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Applied:</p>
                                        <p className="font-medium">{new Date(application.appliedAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Last updated:</p>
                                        <p className="font-medium">{new Date(application.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                    {application.activatedAt && (
                                        <div>
                                            <p className="text-gray-500">Activated:</p>
                                            <p className="font-medium">{new Date(application.activatedAt).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 md:p-6 bg-gray-50 border-t flex flex-col sm:flex-row gap-3 justify-between">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="btn btn-outline btn-sm"
                        >
                            {showDetails ? 'Show Less' : 'View Full Details'}
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="btn btn-primary btn-sm"
                        >
                            🖨️ Print
                        </button>
                    </div>

                    {/* Full Details */}
                    {showDetails && (
                        <div className="p-4 md:p-6 border-t bg-white">
                            <h3 className="font-semibold text-gray-700 mb-4">All Data</h3>
                            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-xs">
                                {JSON.stringify(application, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyApplication;