// src/layout/MainLayout/DashboardLayout.jsx
import { NavLink, Outlet } from 'react-router';
import {
    FaHome,
    FaBox,
    FaHistory,
    FaMotorcycle,
    FaTruck,
    FaClipboardList,
    FaUserCheck,
    FaMoneyBill,
    FaTasks,
    FaCheckCircle
} from 'react-icons/fa';

import React from 'react';
import useUserRole from '../../Hooks/useUserRole';
import useAuth from '../../Hooks/useAuth';
import ZapShiftLogo from '../../Pages/SharedComponent/Logo/ZapShiftLogo';

const DashboardLayout = () => {
    const { user } = useAuth();
    const { role, isAdmin, isRider, isLoading, refetch } = useUserRole();

    console.log('🔍 DashboardLayout - User role:', role, { isAdmin, isRider });

    // Force refetch on mount to ensure fresh data
    React.useEffect(() => {
        refetch();
    }, []);

    // User menu items
    const getUserMenuItems = () => [
        { path: '/dashboard', icon: FaHome, label: 'Dashboard Home' },
        { path: '/dashboard/my-parcel', icon: FaBox, label: 'My Parcels' },
        { path: '/dashboard/payment-history', icon: FaHistory, label: 'Payment History' },
        { path: '/dashboard/my-application', icon: FaUserCheck, label: 'My Application' },
    ];

    // Rider menu items
    const getRiderMenuItems = () => [
        { path: '/dashboard', icon: FaHome, label: 'Dashboard Home' },
        { path: '/dashboard/rider/rider-deliveries', icon: FaTasks, label: 'Rider Deliveries' },
        { path: '/dashboard/rider/my-earnings', icon: FaMoneyBill, label: 'My Earnings' },
        { path: '/dashboard/my-application', icon: FaClipboardList, label: 'My Application' },
    ];

    // Admin menu items
    const getAdminMenuItems = () => [
        { path: '/dashboard', icon: FaHome, label: 'Dashboard Home' },
        { path: '/dashboard/admin/tracking', icon: FaTruck, label: 'Track All Parcels' },
        { path: '/dashboard/admin/riders/pending', icon: FaMotorcycle, label: 'Pending Riders' },
        { path: '/dashboard/admin/riders/active', icon: FaMotorcycle, label: 'Active Riders' },
        { path: '/dashboard/admin/riders/inactive', icon: FaMotorcycle, label: 'Inactive Riders' },
        { path: '/dashboard/admin/parcels', icon: FaBox, label: 'Parcel Management' },
    ];

    // Select menu items based on role
    let menuItems = [];
    if (isAdmin) {
        menuItems = getAdminMenuItems();
    } else if (isRider) {
        menuItems = getRiderMenuItems();
        console.log('✅ Showing rider menu');
    } else {
        menuItems = getUserMenuItems();
        console.log('✅ Showing user menu');
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="drawer lg:drawer-open">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Navbar for mobile */}
                <div className="p-4 bg-base-100 shadow-sm flex justify-between lg:hidden">
                    <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </label>
                    <span className="text-lg font-bold">Dashboard</span>
                </div>

                {/* Main content */}
                <div className="p-6 bg-gray-50 min-h-screen">
                    <Outlet />
                </div>
            </div>

            {/* Sidebar */}
            <div className="drawer-side">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                    {/* Sidebar header */}
                    <div className="mb-8 text-center">
                        <ZapShiftLogo />
                    </div>

                    {/* Menu items */}
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    end={item.path === '/dashboard'} // Add this prop
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive
                                            ? 'bg-primary text-black shadow-md'
                                            : 'hover:bg-base-300'
                                        }`
                                    }
                                >
                                    <item.icon className="text-lg" />
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* User info */}
                    <div className="mt-auto pt-6 border-t border-base-300">
                        <div className="flex items-center gap-3 p-3">
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName || 'User'}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=3b82f6&color=fff`;
                                    }}
                                />
                            ) : (
                                <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {user?.displayName?.charAt(0)?.toUpperCase() ||
                                        user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-sm">{user?.displayName || 'User'}</p>
                                <p className="text-xs opacity-70 capitalize">
                                    {role} {/* This will now show correctly */}
                                </p>
                                <p className="text-xs opacity-50 truncate max-w-37.5">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;