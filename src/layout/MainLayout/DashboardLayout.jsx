import React from 'react';
import { FaHistory, FaHome, FaTruck } from 'react-icons/fa';
import { NavLink, Outlet } from 'react-router';
import ZapShiftLogo from '../../Pages/SharedComponent/Logo/ZapShiftLogo';
import { FaHouse, FaMotorcycle } from 'react-icons/fa6';

const DashboardLayout = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle lg:hidden" />
            <div className="drawer-content flex flex-col items-center justify-center">
                {/* Page content here */}
                <div className="navbar w-full">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current lg:hidden"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                    <div className="mx-2 flex-1 px-2 flex items-center gap-2 lg:hidden">
                        <FaHome />Dash Board
                    </div>
                </div>
                {/* page content here  */}
                <Outlet />
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <div className='mb-5'>
                        <ZapShiftLogo />
                    </div>
                    <li>
                        <NavLink to={'/dashboard-home'}>
                            <FaHouse /> Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/dashboard/my-parcel'}>
                            <FaTruck /> My Parcel
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/dashboard/payment-history'}>
                            <FaHistory />Payment History
                        </NavLink>
                    </li>

                    {/* Rider Collapsible Menu */}
                    <li>
                        <details>
                            <summary className="flex items-center">
                                <FaMotorcycle className="mr-2" />
                                Rider
                            </summary>
                            <ul>
                                <li>
                                    <NavLink to={'/dashboard/become-rider'}>
                                        Become Rider
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/dashboard/pending-rider'}>
                                        Pending Rider
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/active-rider'}>
                                        Active Rider
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={'/inactive-rider'}>
                                        Inactive Rider
                                    </NavLink>
                                </li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;