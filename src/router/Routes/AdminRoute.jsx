import { Navigate } from 'react-router';
import useAuth from '../../Hooks/useAuth';
import useUserRole from '../../Hooks/useUserRole';
import Loading from '../../Pages/ErrorPage/Loading';


const AdminRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { role, isLoading } = useUserRole();

  // Show loading while checking authentication and role
  if (authLoading || isLoading) {
    return <Loading />;
  }

  // Not logged in - redirect to signin
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Check if user is admin
  if (role !== 'admin') {
    return <Navigate to="/forbidden" replace />;
  }

  // User is admin - allow access
  return children;
};

export default AdminRoute;