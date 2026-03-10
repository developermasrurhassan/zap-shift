// src/components/Tracking/RiderTrackingView.jsx
import React from 'react';
import { useParams } from 'react-router';
import useTracking from '../../../Hooks/useTracking';
import Loading from '../../ErrorPage/Loading';
import TrackingDetails from '../../TrackParcel/TrackingDetails';


const RiderTrackingView = () => {
    const { parcelId } = useParams();
    const { useRiderTracking } = useTracking();

    const { data, isLoading, error, refetch } = useRiderTracking(parcelId);

    if (isLoading) return <Loading />;

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="alert alert-error shadow-lg">
                        <div>
                            <span>Error: {error.message}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Parcel Tracking</h1>
                    <button
                        onClick={() => refetch()}
                        className="btn btn-sm btn-outline"
                    >
                        🔄 Refresh
                    </button>
                </div>

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

export default RiderTrackingView;