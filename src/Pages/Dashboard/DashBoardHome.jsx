import useUserRole from "../../Hooks/useUserRole";
import Forbidden from "../ErrorPage/Forbidden";
import Loading from "../ErrorPage/Loading";
import AdminDashboardHome from "./AdminDashboardHome/AdminDashboardHome";
import RiderDashboard from "./RiderDashboard/RiderDashboard";
import UserDashboardHome from "./UserDashboardHome/UserDashboardHome";


const DashboardHome = () => {
    const { isAdmin,
        isRider,
        isUser, isLoading } = useUserRole();

    if (isLoading) {
        return <Loading />;
    }

    if (isUser) {
        return <UserDashboardHome />;
    } else if (isRider) {
        return <RiderDashboard />;
    } else if (isAdmin) {
        return <AdminDashboardHome />;
    }
    else {
        return <Forbidden />
    }
};

export default DashboardHome;