// src/components/Tracking/AdminTrackingView.jsx
import React from 'react';
import { useParams } from 'react-router';
import useTracking from '../../../Hooks/useTracking';
import Loading from '../../ErrorPage/Loading';
import TrackingDetails from '../../TrackParcel/TrackingDetails';


const AdminTrackingView = () => {
    const { trackingId } = useParams();
    const { useAdminTracking } = useTracking();

    const { data, isLoading, error, refetch } = useAdminTracking(trackingId);

    if (isLoading) return <Loading />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Admin Parcel Tracking</h1>
                    <button
                        onClick={() => refetch()}
                        className="btn btn-sm btn-outline"
                    >
                        🔄 Refresh
                    </button>
                </div>

                {error && (
                    <div className="alert alert-error shadow-lg mb-6">
                        <div>
                            <span>Error: {error.message}</span>
                        </div>
                    </div>
                )}

                {data ? (
                    <TrackingDetails trackingData={data} />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No tracking data found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTrackingView;