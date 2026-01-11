import React from 'react';
import { FaHome } from 'react-icons/fa';
import { NavLink, Outlet } from 'react-router';
import ZapShiftLogo from '../../Pages/SharedComponent/Logo/ZapShiftLogo';

const DashboardLayout = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle lg:hidden" />
            <div className="drawer-content flex flex-col items-center justify-center">
                {/* Page content here */}
                <div className="navbar  w-full ">
                    <div className="flex-none ">
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
                    <div className="mx-2 flex-1 px-2  flex items-center gap-2 lg:hidden"><FaHome />Dash Board</div>

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
                    <li><NavLink to={'/dashboard-home'}>Home</NavLink></li>
                    <li><NavLink to={'/dashboard/my-parcel'}>My Parcel</NavLink></li>
                </ul>
            </div>
        </div >
    );
};

export default DashboardLayout;