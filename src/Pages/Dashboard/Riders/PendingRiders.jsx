import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import useRider from '../../../Hooks/useRider';
import Loading from '../../ErrorPage/Loading';
import { ImCross } from 'react-icons/im';
import Swal from 'sweetalert2';
import { FaCheck, FaEye } from 'react-icons/fa'

const PendingRiders = () => {
  const { useAllPendingRiders, updateStatus, deleteRider } = useRider();
  const { data: riders = [], isLoading, refetch, error } = useAllPendingRiders();
  const [selectedRider, setSelectedRider] = useState(null);
  const [showModal, setShowModal] = useState(false);






  const handleAccept = async (riderId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You want to accept this rider?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, accept it!',
        cancelButtonText: 'Cancel',
        background: '#fff',
        backdrop: 'rgba(0,0,0,0.4)'
      });

      if (result.isConfirmed) {
        await updateStatus({ riderId, status: 'active' });

        await Swal.fire({
          title: 'Accepted!',
          text: 'Rider has been accepted successfully.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        });

        toast.success('Rider accepted successfully!');
      }
    } catch (error) {
      toast.error('Failed to accept rider');
      console.error('Accept error:', error);
    }
  };

  const handleReject = async (riderId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You want to reject this rider? This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, reject it!',
        cancelButtonText: 'Cancel',
        background: '#fff',
        backdrop: 'rgba(0,0,0,0.4)'
      });

      if (result.isConfirmed) {
        await deleteRider(riderId);

        await Swal.fire({
          title: 'Rejected!',
          text: 'Rider has been rejected.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        });

        toast.success('Rider rejected successfully!');
      }
    } catch (error) {
      toast.error('Failed to reject rider');
      console.error('Reject error:', error);
    }
  };

  const handleViewDetails = (rider) => {
    setSelectedRider(rider);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRider(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading riders: {error.message}</p>
          <button onClick={() => refetch()} className="mt-2 btn btn-sm btn-outline">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pending Rider Applications</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Review and manage all pending rider applications
        </p>
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-3 text-xl">⏳</div>
            <p className="text-yellow-800">
              <span className="font-semibold">{riders.length}</span> application(s) waiting for review
            </p>
          </div>
        </div>
      </div>

      {/* Table - Responsive */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rider</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {riders.length > 0 ? (
                riders.map((rider, index) => (
                  <tr key={rider._id} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">{rider.name?.charAt(0) || 'R'}</span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{rider.name}</div>
                          <div className="md:hidden text-xs text-gray-500">{rider.region}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="text-sm text-gray-900">{rider.email}</div>
                      <div className="text-xs text-gray-500">{rider.phone || 'No phone'}</div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="text-sm">{rider.region}</div>
                      <div className="text-xs text-gray-500">{rider.district}</div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{new Date(rider.appliedAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleViewDetails(rider)}
                          className="btn btn-xs btn-ghost"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleAccept(rider._id)}
                          className="btn btn-xs btn-success text-white"
                          title="Accept"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleReject(rider._id)}
                          className="btn btn-xs btn-error text-white"
                          title="Reject"
                        >
                          <ImCross />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="text-4xl mb-3">📭</div>
                      <p className="text-lg font-medium">No pending applications</p>
                      <p className="text-sm">All rider applications have been reviewed.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rider Details Modal - FIXED: Higher z-index and no fade */}
      {showModal && selectedRider && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal panel */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full relative z-[10000]">
              <div className="bg-white px-6 pt-6 pb-4 sm:p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                    <p className="text-gray-600 text-xs mt-1">ID: {selectedRider._id?.slice(-8)}</p>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">
                    ×
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm font-medium">{selectedRider.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm">{selectedRider.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm">{selectedRider.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                        Pending
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-2">Documents</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">License</p>
                        <p>{selectedRider.drivingLicense}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">NID</p>
                        <p>{selectedRider.nid}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-2">Location</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Region</p>
                        <p>{selectedRider.region}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">District</p>
                        <p>{selectedRider.district}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-2">Bike</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Brand</p>
                        <p>{selectedRider.bikeBrand}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Model</p>
                        <p>{selectedRider.bikeModel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Reg No.</p>
                        <p className="text-xs">{selectedRider.bikeRegistration}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-2">About</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedRider.about}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row gap-3 justify-end">
                  <button onClick={closeModal} className="btn btn-outline btn-sm">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedRider._id);
                      closeModal();
                    }}
                    className="btn btn-error btn-sm text-white"
                  >
                    <ImCross />
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleAccept(selectedRider._id);
                      closeModal();
                    }}
                    className="btn btn-success btn-sm text-white"
                  >
                    <FaCheck /> Accept
                  </button>
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