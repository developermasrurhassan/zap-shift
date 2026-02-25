import useUserRole from "../../Hooks/useUserRole";
import Loading from "../ErrorPage/Loading";
import AdminDashboardHome from "./AdminDashboardHome/AdminDashboardHome";
import UserDashboardHome from "./UserDashboardHome/UserDashboardHome";


const DashboardHome = () => {
    const { isAdmin, isLoading } = useUserRole();

    if (isLoading) {
        return <Loading />;
    }

    return isAdmin ? <AdminDashboardHome /> : <UserDashboardHome />;
};

export default DashboardHome;