import { Navigate } from 'react-router';
import useUserRole from '../../Hooks/useUserRole';
import Loading from '../../Pages/ErrorPage/Loading';


const AdminRoute = ({ children }) => {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return <Loading />;
  }

  if (role !== 'admin') {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default AdminRoute;