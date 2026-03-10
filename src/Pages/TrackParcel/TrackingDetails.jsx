// src/components/Tracking/TrackingDetails.jsx
import React from 'react';
import { motion } from 'motion/react';
import {
    FaTruck,
    FaBox,
    FaMapMarkerAlt,
    FaUser,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaPhone
} from 'react-icons/fa';
import useTracking from '../../Hooks/useTracking';

const TrackingDetails = ({ trackingData, showFullDetails = true }) => {
    const { getStatusConfig, formatDate, getProgress } = useTracking();

    if (!trackingData) {
        return (
            <div className="text-center py-12">
                <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">No tracking data available</h3>
            </div>
        );
    }

    const statusConfig = getStatusConfig(trackingData.status);
    const progress = getProgress(trackingData.status);

    return (
        <div className="space-y-6">
            {/* Status Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-6 border-2 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
            >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="text-4xl">
                        {trackingData.status === 'delivered' && <FaCheckCircle />}
                        {trackingData.status === 'in-transit' && <FaTruck />}
                        {trackingData.status === 'pending' && <FaClock />}
                        {trackingData.status === 'failed' && <FaExclamationTriangle />}
                        {!['delivered', 'in-transit', 'pending', 'failed'].includes(trackingData.status) && <FaBox />}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1">
                            {trackingData.parcelName}
                        </h2>
                        <p className="text-lg opacity-90">
                            Status: <span className="font-semibold">{statusConfig.label}</span>
                        </p>
                        <p className="text-sm opacity-75 mt-1 font-mono">
                            Tracking ID: {trackingData.trackingId}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Progress Bar */}
            {progress > 0 && progress < 100 && (
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span>Delivery Progress</span>
                        <span className="font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full ${trackingData.status === 'delivered' ? 'bg-green-500' :
                                    trackingData.status === 'failed' ? 'bg-red-500' :
                                        'bg-primary'
                                }`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaClock className="text-primary" />
                    Delivery Timeline
                </h3>
                <div className="space-y-4">
                    {trackingData.timeline?.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3"
                        >
                            <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                {step.completed ? <FaCheckCircle className="text-sm" /> : <FaClock className="text-sm" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                    <span className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {step.status}
                                    </span>
                                    {step.date && (
                                        <span className="text-sm text-gray-500">
                                            {formatDate(step.date)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Parcel Details Grid */}
            {showFullDetails && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sender Info */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FaUser className="text-primary" />
                                Sender Details
                            </h3>
                            <div className="space-y-3">
                                <p className="font-medium">{trackingData.senderName}</p>
                                <p className="text-sm text-gray-600 flex items-start gap-2">
                                    <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
                                    <span>{trackingData.senderAddress}</span>
                                </p>
                                {trackingData.senderPhone && (
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <FaPhone className="text-gray-400" />
                                        {trackingData.senderPhone}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Receiver Info */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FaUser className="text-primary" />
                                Receiver Details
                            </h3>
                            <div className="space-y-3">
                                <p className="font-medium">{trackingData.receiverName}</p>
                                <p className="text-sm text-gray-600 flex items-start gap-2">
                                    <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
                                    <span>{trackingData.receiverAddress}, {trackingData.receiverDistrict}</span>
                                </p>
                                {trackingData.receiverPhone && (
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                        <FaPhone className="text-gray-400" />
                                        {trackingData.receiverPhone}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Current Location */}
                    {trackingData.currentLocation && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-primary" />
                                Current Location
                            </h3>
                            <p className="font-medium">{trackingData.currentLocation}</p>
                            {trackingData.estimatedDelivery && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Estimated Delivery: {new Date(trackingData.estimatedDelivery).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Status History */}
                    {trackingData.statusHistory?.length > 0 && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Status History</h3>
                            <div className="space-y-3">
                                {trackingData.statusHistory.map((history, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b last:border-0">
                                        <div>
                                            <span className="font-medium capitalize">
                                                {history.status.replace('-', ' ')}
                                            </span>
                                            {history.note && (
                                                <p className="text-sm text-gray-600">{history.note}</p>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {formatDate(history.timestamp)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Assigned Rider */}
                    {trackingData.assignedRiderName && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FaUser className="text-primary" />
                                Assigned Rider
                            </h3>
                            <p className="font-medium">{trackingData.assignedRiderName}</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TrackingDetails;