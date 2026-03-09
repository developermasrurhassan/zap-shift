// src/Routes/RiderRoute.jsx
import { Navigate, useLocation } from 'react-router';
import useAuth from '../../Hooks/useAuth';
import useUserRole from '../../Hooks/useUserRole';
import Loading from '../../Pages/ErrorPage/Loading';

const RiderRoute = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const { isRider, isLoading: roleLoading } = useUserRole();
    const location = useLocation();

    console.log('🔐 RiderRoute - Auth loading:', authLoading, 'Role loading:', roleLoading, 'isRider:', isRider);

    // Show loading while checking authentication and role
    if (authLoading || roleLoading) {
        return <Loading />;
    }

    // Not logged in - redirect to signin
    if (!user) {
        return <Navigate state={{ from: location.pathname }} to="/signin" replace />;
    }

    // Check if user is a rider (using isRider from hook)
    if (!isRider) {
        console.log('⛔ RiderRoute - Access denied. User is not a rider');
        return <Navigate to="/forbidden" replace />;
    }

    // User is a rider - allow access
    console.log('✅ RiderRoute - Access granted');
    return children;
};

export default RiderRoute;