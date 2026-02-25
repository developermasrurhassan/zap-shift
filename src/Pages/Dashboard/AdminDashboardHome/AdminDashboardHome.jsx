import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
    FaSearch,
    FaUserCog,
    FaUsers,
    FaMotorcycle,
    FaBox,
    FaDollarSign,
    FaTimes,
    FaSpinner,
    FaUserCheck,
    FaUserClock
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
// import { useQuery } from '@tanstack/react-query';


const AdminDashboardHome = () => {
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef(null);

    // Debounce search input
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (searchTerm) {
            setIsSearching(true);
            searchTimeoutRef.current = setTimeout(() => {
                setDebouncedSearchTerm(searchTerm);
                setIsSearching(false);
            }, 500);
        } else {
            setDebouncedSearchTerm('');
            setIsSearching(false);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm]);

    // Fetch all users with search (searches both name and email)
    const {
        data: users = [],
        isLoading: usersLoading,
        refetch: refetchUsers,
        isFetching: isUsersFetching
    } = useQuery({
        queryKey: ['all-users', debouncedSearchTerm],
        queryFn: async () => {
            try {
                const res = await axiosSecure.get(`/users?search=${debouncedSearchTerm}`);
                return res.data.data || [];
            } catch (error) {
                console.error('Error fetching users:', error);
                if (error.response?.status !== 401 && error.response?.status !== 403) {
                    toast.error('Failed to load users');
                }
                return [];
            }
        },
        staleTime: 10000,
        cacheTime: 30000,
    });

    // Fetch system stats
    const { data: stats = {}, refetch: refetchStats, isFetching: isStatsFetching } = useQuery({
        queryKey: ['system-stats'],
        queryFn: async () => {
            try {
                const res = await axiosSecure.get('/admin/stats');
                return res.data.data || {};
            } catch (error) {
                console.error('Error fetching stats:', error);
                return {};
            }
        },
        staleTime: 30000,
        cacheTime: 60000,
    });

    // Make admin mutation
    const makeAdminMutation = useMutation({
        mutationFn: (userId) => axiosSecure.patch(`/users/make-admin/${userId}`),
        onMutate: async (userId) => {
            await queryClient.cancelQueries({ queryKey: ['all-users', debouncedSearchTerm] });

            const previousUsers = queryClient.getQueryData(['all-users', debouncedSearchTerm]);

            queryClient.setQueryData(['all-users', debouncedSearchTerm], (old) => {
                return old?.map(user =>
                    user._id === userId ? { ...user, role: 'admin' } : user
                ) || [];
            });

            return { previousUsers };
        },
        onError: (err, userId, context) => {
            queryClient.setQueryData(['all-users', debouncedSearchTerm], context?.previousUsers);
            toast.error(err.response?.data?.message || 'Failed to make admin');
        },
        onSuccess: () => {
            toast.success('User promoted to admin successfully!');
        },
    });

    const handleMakeAdmin = async (userId, userEmail) => {
        const result = await Swal.fire({
            title: 'Make Admin?',
            html: `<p class="text-gray-600">Are you sure you want to make <span class="font-semibold text-primary">${userEmail}</span> an admin?</p>
             <p class="text-sm text-gray-500 mt-2">They will have full access to admin features.</p>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, make admin',
            cancelButtonText: 'Cancel',
            background: '#fff',
            backdrop: 'rgba(0,0,0,0.4)'
        });

        if (result.isConfirmed) {
            makeAdminMutation.mutate(userId);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setDebouncedSearchTerm('');
    };

    const refreshAll = () => {
        refetchUsers();
        refetchStats();
        toast.success('Data refreshed');
    };

    const statsCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers || 0,
            icon: FaUsers,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Total Riders',
            value: stats.totalRiders || 0,
            icon: FaMotorcycle,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Total Parcels',
            value: stats.totalParcels || 0,
            icon: FaBox,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue?.toLocaleString() || 0}`,
            icon: FaDollarSign,
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-600'
        },
    ];

    const riderStatusData = [
        { name: 'Pending', value: stats.pendingRiders || 0, color: '#f59e0b' },
        { name: 'Active', value: stats.activeRiders || 0, color: '#10b981' },
        { name: 'Inactive', value: stats.inactiveRiders || 0, color: '#6b7280' },
        { name: 'Rejected', value: stats.rejectedRiders || 0, color: '#ef4444' },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-md p-6 flex items-center hover:shadow-lg transition-shadow"
                    >
                        <div className={`${card.bgColor} w-14 h-14 rounded-xl flex items-center justify-center text-2xl mr-4 ${card.textColor}`}>
                            <card.icon />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{card.title}</p>
                            {isStatsFetching ? (
                                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
                            ) : (
                                <p className="text-2xl font-bold">{card.value}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FaUserCheck className="text-primary" />
                        Rider Status Distribution
                    </h3>
                    <button
                        onClick={refreshAll}
                        className="btn btn-sm btn-outline gap-2"
                        disabled={isStatsFetching || isUsersFetching}
                    >
                        {(isStatsFetching || isUsersFetching) && (
                            <FaSpinner className="animate-spin" />
                        )}
                        Refresh Data
                    </button>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={riderStatusData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* User Management Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b bg-linear-to-r from-gray-50 to-white">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <FaUserCog className="text-primary" />
                        User Management
                    </h3>

                    {/* Modern Search Bar - Searches both Name and Email */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className={`${isSearching ? 'text-primary' : 'text-gray-400'}`} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            className="input input-bordered w-full pl-10 pr-24 py-3 focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                            {isSearching && (
                                <div className="px-2 py-1">
                                    <FaSpinner className="animate-spin text-primary" />
                                </div>
                            )}
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Clear search"
                                >
                                    <FaTimes className="text-gray-500" />
                                </button>
                            )}
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                {users.length} result{users.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>

                    {/* Search Results Info */}
                    {debouncedSearchTerm && (
                        <div className="mt-2 flex items-center gap-2 text-sm">
                            <span className="text-gray-600">Showing results for:</span>
                            <span className="font-semibold text-primary bg-primary/5 px-2 py-1 rounded-md">
                                "{debouncedSearchTerm}"
                            </span>
                        </div>
                    )}
                </div>

                {/* Users Table - Fixed with proper spacing and responsiveness */}
                <div className="overflow-x-auto">
                    <table className="table table-xs md:table-sm w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-2 py-3 text-base font-bold">#</th>
                                <th className="px-2 py-3 text-base font-bold">Name</th>
                                <th className="px-2 py-3 text-base font-bold hidden sm:table-cell">Email</th>
                                <th className="px-2 py-3 text-base font-bold">Role</th>
                                <th className="px-2 py-3 text-base font-bold hidden md:table-cell">Joined</th>
                                <th className="px-2 py-3 text-base font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersLoading || isUsersFetching ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-2 py-2"><div className="h-4 w-6 bg-gray-200 animate-pulse rounded"></div></td>
                                        <td className="px-2 py-2"><div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div></td>
                                        <td className="px-2 py-2 hidden sm:table-cell"><div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div></td>
                                        <td className="px-2 py-2"><div className="h-5 w-14 bg-gray-200 animate-pulse rounded-full"></div></td>
                                        <td className="px-2 py-2 hidden md:table-cell"><div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div></td>
                                        <td className="px-2 py-2"><div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div></td>
                                    </tr>
                                ))
                            ) : users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4 text-xs font-medium">{index + 1}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* Image with fallback */}
                                                {user.photoURL ? (
                                                    <img
                                                        src={user.photoURL}
                                                        alt={user.displayName || 'User'}  // Change user.name to user.displayName
                                                        className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || 'User');
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                        {user.displayName?.charAt(0)?.toUpperCase() ||
                                                            user.email?.charAt(0)?.toUpperCase() || 'U'}
                                                    </div>
                                                )}

                                                <span className="font-medium text-sm truncate max-w-25 sm:max-w-30">
                                                    {user.name || 'N/A'}
                                                </span>
                                            </div>
                                            {/* Email on mobile - shown below name */}
                                            <div className="sm:hidden text-xs text-gray-500 mt-1 truncate max-w-37.5">
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-2 py-4 text-xs md:text-base hidden sm:table-cell truncate max-w-37.5 lg:max-w-50">
                                            {user.email}
                                        </td>
                                        <td className="px-2 py-4">
                                            <span className={`badge badge-md ${user.role === 'admin' ? 'badge-primary text-black' :
                                                user.role === 'rider' ? 'badge-success' :
                                                    'badge-ghost'
                                                }`}>
                                                {user.role === 'admin' && <FaUserCheck className="mr-1 text-xs" />}
                                                {user.role === 'rider' && <FaMotorcycle className="mr-1 text-xs" />}
                                                {user.role === 'user' && <FaUserClock className="mr-1 text-xs" />}
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="px-2 py-4 text-xs md:text-base hidden md:table-cell">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </td>
                                        <td className="px-2 py-4">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleMakeAdmin(user._id, user.email)}
                                                    className="btn btn-primary text-black btn-sm whitespace-nowrap min-w-17.5"
                                                    disabled={makeAdminMutation.isPending}
                                                >
                                                    {makeAdminMutation.isPending ? (
                                                        <span className="loading loading-spinner loading-xs"></span>
                                                    ) : (
                                                        'Make Admin'
                                                    )}
                                                </button>
                                            )}
                                            {user.role === 'admin' && (
                                                <span className="text-xs text-gray-500 italic px-2">Admin</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <FaUsers className="text-4xl mb-2 text-gray-300" />
                                            <p className="text-sm font-medium">
                                                {debouncedSearchTerm ? 'No users found' : 'No users available'}
                                            </p>
                                            {debouncedSearchTerm && (
                                                <button
                                                    onClick={clearSearch}
                                                    className="btn btn-xs btn-outline mt-2"
                                                >
                                                    Clear Search
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                {users.length > 0 && (
                    <div className="px-4 py-4 bg-gray-50 border-t flex justify-between items-center text-xs text-gray-600">
                        <span>
                            Showing <span className="font-semibold">{users.length}</span> users
                        </span>
                        <span className="badge badge-outline badge-md">
                            {users.filter(u => u.role === 'admin').length} Admins
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardHome;