import useAuth from '../../Hooks/useAuth';
import { Navigate, useLocation } from 'react-router';
import Loading from '../../Pages/ErrorPage/Loading';

const PrivateRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    (location);

    if (loading) {
        return <Loading></Loading>
    }

    if (!user) {
        return <Navigate state={{ from: location.pathname }} to="/signin"></Navigate>
    }

    return children;
};

export default PrivateRoutes;