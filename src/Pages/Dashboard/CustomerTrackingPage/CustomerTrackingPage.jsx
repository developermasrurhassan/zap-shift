// src/pages/CustomerTrackingPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaBox, FaTruck, FaCheck, FaClock } from 'react-icons/fa';
import { FiPackage } from 'react-icons/fi';

const CustomerTrackingPage = () => {
  const [trackingId, setTrackingId] = useState('');
  const [parcelData, setParcelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError('');
    setParcelData(null);

    try {
      const response = await axios.get(`https://zap-shift-server-mu-ashy.vercel.app/track/${trackingId}`);
      if (response.data.success) {
        setParcelData(response.data.data);
      } else {
        setError('Parcel not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to track parcel');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-500',
      'confirmed': 'bg-blue-500',
      'assigned': 'bg-indigo-500',
      'picked-up': 'bg-purple-500',
      'in-transit': 'bg-blue-600',
      'out-for-delivery': 'bg-orange-500',
      'delivered': 'bg-green-500',
      'failed': 'bg-red-500',
      'cancelled': 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Parcel
          </h1>
          <p className="text-lg text-gray-600">
            Enter your tracking number to get real-time updates
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiPackage className="absolute left-4 top-4 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Enter tracking number (e.g., ZP-2024-001)"
                className="input input-bordered w-full pl-12 py-6 text-lg"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary py-6 px-8 text-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <FaSearch />
                  Track
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="alert alert-error mt-4">
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Tracking Results */}
        {parcelData && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            {/* Tracking Header */}
            <div className="border-b pb-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {parcelData.parcelName}
                  </h2>
                  <p className="text-gray-600 font-mono mt-1">
                    Tracking Number: <span className="text-primary font-bold">{parcelData.trackingId}</span>
                  </p>
                </div>
                <div className={`${getStatusColor(parcelData.status)} text-white px-6 py-3 rounded-full font-semibold`}>
                  {parcelData.status.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Delivery Timeline</h3>
              <div className="space-y-4">
                {parcelData.timeline.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                      {step.completed ? <FaCheck size={14} /> : <FaClock size={14} />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.status}
                      </p>
                      {step.date && (
                        <p className="text-sm text-gray-500">
                          {new Date(step.date).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FaBox className="text-primary" />
                  Parcel Details
                </h4>
                <p><span className="text-gray-600">Name:</span> {parcelData.parcelName}</p>
                <p><span className="text-gray-600">Status:</span> {parcelData.status}</p>
                <p><span className="text-gray-600">Current Location:</span> {parcelData.currentLocation}</p>
                <p><span className="text-gray-600">Est. Delivery:</span> {parcelData.estimatedDelivery || 'N/A'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FaTruck className="text-primary" />
                  Delivery Information
                </h4>
                <p><span className="text-gray-600">Rider:</span> {parcelData.assignedRiderName || 'Not assigned'}</p>
                <p><span className="text-gray-600">Last Update:</span> {
                  parcelData.statusHistory?.[parcelData.statusHistory.length - 1]?.timestamp
                    ? new Date(parcelData.statusHistory[parcelData.statusHistory.length - 1].timestamp).toLocaleString()
                    : 'N/A'
                }</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerTrackingPage;