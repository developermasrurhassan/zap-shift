import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import useRider from '../../../Hooks/useRider';
import Loading from '../../ErrorPage/Loading';

const PendingRiders = () => {
  const { usePendingRiders, updateStatus, deleteRider } = useRider();
  const { data: response = {}, isLoading, refetch } = usePendingRiders();
  const riders = response.data || []; // Extract data array
  const [selectedRider, setSelectedRider] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAccept = async (riderId) => {
    if (window.confirm('Are you sure you want to accept this rider?')) {
      try {
        await updateStatus({ riderId, status: 'active' });
        refetch();
      } catch (error) {
        toast.error('Failed to accept rider');
      }
    }
  };

  const handleReject = async (riderId) => {
    if (window.confirm('Are you sure you want to reject this rider?')) {
      try {
        await deleteRider(riderId);
        refetch();
      } catch (error) {
        toast.error('Failed to reject rider');
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
        <h1 className="text-3xl font-bold text-gray-900">Pending Rider Applications</h1>
        <p className="text-gray-600 mt-2">
          Review and manage new rider applications. Accept qualified applicants or reject unsuitable ones.
        </p>
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-yellow-800">
              <span className="font-semibold">{riders.length}</span> application(s) waiting for review
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
                  Applied Date
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
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold">{rider.name?.charAt(0) || 'R'}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                          <div className="text-sm text-gray-500">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
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
                        {new Date(rider.appliedAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(rider.appliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                          onClick={() => handleAccept(rider._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          title="Accept Rider"
                        >
                          <span className="mr-1">✅</span> Accept
                        </button>
                        <button
                          onClick={() => handleReject(rider._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="Reject Rider"
                        >
                          <span className="mr-1">❌</span> Reject
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="mt-2 text-lg font-medium">No pending applications</p>
                      <p className="mt-1">All rider applications have been reviewed.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rider Details Modal */}
      {showModal && selectedRider && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowModal(false)}></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
              <div className="bg-white px-6 pt-6 pb-6 sm:p-8">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Rider Application Details</h3>
                    <p className="text-gray-600 text-sm mt-1">Application ID: {selectedRider._id?.slice(-8)}</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500 text-2xl">
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Display all rider details here */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">Personal Information</h4>
                      <p><span className="text-gray-500">Name:</span> {selectedRider.name}</p>
                      <p><span className="text-gray-500">Email:</span> {selectedRider.email}</p>
                      <p><span className="text-gray-500">Phone:</span> {selectedRider.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Documents</h4>
                      <p><span className="text-gray-500">Driving License:</span> {selectedRider.drivingLicense}</p>
                      <p><span className="text-gray-500">NID:</span> {selectedRider.nid}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">Location</h4>
                      <p><span className="text-gray-500">Region:</span> {selectedRider.region}</p>
                      <p><span className="text-gray-500">District:</span> {selectedRider.district}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Bike Information</h4>
                      <p><span className="text-gray-500">Brand:</span> {selectedRider.bikeBrand}</p>
                      <p><span className="text-gray-500">Model:</span> {selectedRider.bikeModel}</p>
                      <p><span className="text-gray-500">Registration:</span> {selectedRider.bikeRegistration}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700">About Rider</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-wrap">{selectedRider.about}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t flex justify-between">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    Close
                  </button>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        handleReject(selectedRider._id);
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      ❌ Reject Application
                    </button>
                    <button
                      onClick={() => {
                        handleAccept(selectedRider._id);
                        setShowModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      ✅ Accept as Rider
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;