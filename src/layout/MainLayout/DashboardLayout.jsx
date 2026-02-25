import { NavLink, Outlet } from 'react-router';
import { FaHome, FaBox, FaHistory, FaCreditCard, FaMotorcycle, FaUsers, FaChartBar, FaCog } from 'react-icons/fa';
import useUserRole from '../../Hooks/useUserRole';
import useAuth from '../../Hooks/useAuth'; // Add this import
import ZapShiftLogo from '../../Pages/SharedComponent/Logo/ZapShiftLogo';
import UseAxiosSecure from '../../Hooks/UseAxiosSecure';

const DashboardLayout = () => {
    const { user } = useAuth(); // Add this line to get user data
    const { isAdmin } = useUserRole();


    const menuItems = [
        { path: '/dashboard', icon: FaHome, label: 'Dashboard Home', adminOnly: false },
        { path: '/dashboard/my-parcel', icon: FaBox, label: 'My Parcels', adminOnly: false },
        { path: '/dashboard/payment-history', icon: FaHistory, label: 'Payment History', adminOnly: false },
    ];

    const adminItems = [
        // { path: '/dashboard/admin/users', icon: FaUsers, label: 'User Management', adminOnly: true },
        { path: '/dashboard/admin/riders/pending', icon: FaMotorcycle, label: 'Pending Riders', adminOnly: true },
        { path: '/dashboard/admin/riders/active', icon: FaMotorcycle, label: 'Active Riders', adminOnly: true },
        { path: '/dashboard/admin/riders/inactive', icon: FaMotorcycle, label: 'Inactive Riders', adminOnly: true },
        // { path: '/dashboard/admin/stats', icon: FaChartBar, label: 'System Stats', adminOnly: true },
        // { path: '/dashboard/admin/settings', icon: FaCog, label: 'Settings', adminOnly: true },
    ];

    const allMenuItems = isAdmin ? [...menuItems, ...adminItems] : menuItems;

    return (
        <div className="drawer lg:drawer-open">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Page content */}
                <div className="p-4 bg-base-100 shadow-sm flex justify-between lg:hidden">
                    <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
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
                        {allMenuItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive
                                            ? 'bg-primary text-white shadow-md'
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
                            <div>
                                <p className="font-semibold text-sm">{user.displayName || 'User'}</p>
                                <p className="text-xs opacity-70">{isAdmin ? 'Administrator' : 'User'}</p>
                                <p className="text-xs opacity-50 truncate max-w-37.5">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;