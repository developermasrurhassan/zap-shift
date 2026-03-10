// src/components/Tracking/UserTrackingView.jsx
import React from 'react';
import { useParams } from 'react-router';
import useTracking from '../../../Hooks/useTracking';
import Loading from '../../ErrorPage/Loading';
import TrackingSearch from '../../TrackParcel/TrackingSearch';
import TrackingDetails from '../../TrackParcel/TrackingDetails';


const UserTrackingView = () => {
    const { trackingId } = useParams();
    const { useUserTracking } = useTracking();

    const { data, isLoading, error, refetch } = useUserTracking(trackingId);

    if (isLoading) return <Loading />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Track Your Parcel</h1>

                <TrackingSearch className="mb-8" />

                {error && (
                    <div className="alert alert-error shadow-lg mb-6">
                        <div>
                            <span>Error: {error.message}</span>
                        </div>
                    </div>
                )}

                {data && <TrackingDetails trackingData={data} />}

                {!trackingId && !data && !error && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Enter a tracking ID to begin</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTrackingView;