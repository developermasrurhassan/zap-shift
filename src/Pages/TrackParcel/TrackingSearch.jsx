// src/components/Tracking/TrackingSearch.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { FaSearch, FaBox } from 'react-icons/fa';
import { motion } from 'motion/react';

const TrackingSearch = ({ onTrack, className = '', placeholder = 'Enter tracking ID' }) => {
    const [trackingId, setTrackingId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!trackingId.trim()) {
            setError('Please enter a tracking ID');
            return;
        }

        setError('');

        if (onTrack) {
            onTrack(trackingId);
        } else {
            navigate(`/track/${trackingId.trim()}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl shadow-md p-6 ${className}`}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <FaBox />
                        </div>
                        <input
                            type="text"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                            placeholder={placeholder}
                            className="input input-bordered w-full pl-10"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        <FaSearch className="mr-2" />
                        Track Parcel
                    </button>
                </div>

                {error && (
                    <p className="text-sm text-error mt-2">{error}</p>
                )}

                <p className="text-xs text-gray-500">
                    Enter your tracking ID (e.g., TRK12345678) to get real-time updates
                </p>
            </form>
        </motion.div>
    );
};

export default TrackingSearch;