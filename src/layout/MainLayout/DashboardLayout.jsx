// src/layout/MainLayout/DashboardLayout.jsx

import { NavLink, Outlet } from "react-router";
import {
    FaHome,
    FaBox,
    FaHistory,
    FaMotorcycle,
    FaTruck,
    FaClipboardList,
    FaUserCheck,
    FaMoneyBill,
    FaTasks
} from "react-icons/fa";

import React from "react";
import useUserRole from "../../Hooks/useUserRole";
import useAuth from "../../Hooks/useAuth";
import ZapShiftLogo from "../../Pages/SharedComponent/Logo/ZapShiftLogo";

const DashboardLayout = () => {

    const { user, logOut } = useAuth();
    const { role, isAdmin, isRider, isLoading, refetch } = useUserRole();

    console.log("🔍 DashboardLayout - User role:", role, { isAdmin, isRider });

    React.useEffect(() => {
        refetch();
    }, []);

    // USER MENU
    const getUserMenuItems = () => [
        { path: "/dashboard", icon: FaHome, label: "Dashboard Home" },
        { path: "/dashboard/my-parcel", icon: FaBox, label: "My Parcels" },
        { path: "/dashboard/payment-history", icon: FaHistory, label: "Payment History" },
        { path: "/dashboard/my-application", icon: FaUserCheck, label: "My Application" }
    ];

    // RIDER MENU
    const getRiderMenuItems = () => [
        { path: "/dashboard", icon: FaHome, label: "Dashboard Home" },

        { path: "/dashboard/rider/rider-deliveries", icon: FaTasks, label: "Rider Deliveries" },
        { path: "/dashboard/rider/my-earnings", icon: FaMoneyBill, label: "My Earnings" },
        { path: "/dashboard/my-application", icon: FaClipboardList, label: "My Application" }
    ];

    // ADMIN MENU
    const getAdminMenuItems = () => [
        { path: "/dashboard", icon: FaHome, label: "Dashboard Home" },
        { path: "/dashboard/admin/tracking", icon: FaTruck, label: "Track All Parcels" },
        { path: "/dashboard/admin/riders/pending", icon: FaMotorcycle, label: "Pending Riders" },
        { path: "/dashboard/admin/riders/active", icon: FaMotorcycle, label: "Active Riders" },
        { path: "/dashboard/admin/riders/inactive", icon: FaMotorcycle, label: "Inactive Riders" },
        { path: "/dashboard/admin/parcels", icon: FaBox, label: "Parcel Management" }
    ];

    let menuItems = [];

    if (isAdmin) {
        menuItems = getAdminMenuItems();
    } else if (isRider) {
        menuItems = getRiderMenuItems();
    } else {
        menuItems = getUserMenuItems();
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

            {/* MAIN CONTENT */}
            <div className="drawer-content flex flex-col">

                {/* MOBILE DASHBOARD NAVBAR */}
                <div className="p-4 bg-base-100 shadow-sm flex items-center justify-between lg:hidden">

                    <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="w-6 h-6 stroke-current"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </label>

                    <span className="text-lg font-bold">Dashboard</span>

                    <div className="flex gap-2">

                        <NavLink to="/" className="btn btn-ghost btn-sm">
                            <FaHome />
                        </NavLink>

                        <button
                            onClick={logOut}
                            className="btn btn-error btn-sm text-white"
                        >
                            Logout
                        </button>

                    </div>

                </div>


                {/* PAGE CONTENT */}
                <div className="p-6 bg-gray-50 min-h-screen">
                    <Outlet />
                </div>

            </div>


            {/* SIDEBAR */}
            <div className="drawer-side">

                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

                <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col">

                    {/* LOGO */}
                    <div className="mb-6 text-center">
                        <ZapShiftLogo />
                    </div>


                    {/* BACK TO WEBSITE */}
                    <ul className="mb-4">
                        <li>
                            <NavLink
                                to="/"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition"
                            >
                                <FaHome />
                                Back to Website
                            </NavLink>
                        </li>
                    </ul>


                    {/* MENU ITEMS */}
                    <ul className="space-y-2">

                        {menuItems.map((item) => (
                            <li key={item.path}>

                                <NavLink
                                    to={item.path}
                                    end={item.path === "/dashboard"}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive
                                            ? "bg-primary text-black shadow-md"
                                            : "hover:bg-base-300"
                                        }`
                                    }
                                >

                                    <item.icon className="text-lg" />
                                    <span>{item.label}</span>

                                </NavLink>

                            </li>
                        ))}

                    </ul>


                    {/* USER PROFILE + LOGOUT */}
                    <div className="mt-auto pt-6 border-t border-base-300">

                        <div className="flex items-center gap-3 p-3">

                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName || "User"}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                user.displayName || "User"
                                            )}&background=3b82f6&color=fff`;
                                    }}
                                />
                            ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {user?.displayName?.charAt(0)?.toUpperCase() ||
                                        user?.email?.charAt(0)?.toUpperCase() ||
                                        "U"}
                                </div>
                            )}

                            <div>

                                <p className="font-semibold text-sm">
                                    {user?.displayName || "User"}
                                </p>

                                <p className="text-xs opacity-70 capitalize">
                                    {role}
                                </p>

                                <p className="text-xs opacity-50 truncate max-w-40">
                                    {user?.email}
                                </p>

                            </div>

                        </div>


                        {/* LOGOUT BUTTON */}
                        <button
                            onClick={logOut}
                            className="btn btn-outline btn-error btn-sm w-full mt-3"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default DashboardLayout;