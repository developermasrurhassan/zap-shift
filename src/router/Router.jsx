import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/MainLayout/RootLayout";
import HomePage from "../Pages/Home/HomePage.jsx/HomePage";
import FAQPage from "../Pages/Home/FAQ/FAQPage";
import AuthLayout from "../layout/MainLayout/AuthLayout";
import Signup from "../Pages/Authentication/Signup/Signup";
import Signin from "../Pages/Authentication/Signin/Signin";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Coverage from "../Pages/Coverage/Coverage";
import SendParcel from "../Pages/SendPercel/SendParcel";
import PrivateRoutes from "./Routes/PrivateRoutes";
import DashboardLayout from "../layout/MainLayout/DashboardLayout";
import MyParcel from "../Pages/Dashboard/MyParcel/MyParcel";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import PendingRiders from "../Pages/Dashboard/Riders/PendingRiders";
import ActiveRiders from "../Pages/Dashboard/Riders/ActiveRiders";
import AdminDashboardHome from "../Pages/Dashboard/AdminDashboardHome/AdminDashboardHome";
import Forbidden from "../Pages/ErrorPage/Forbidden";
import AdminRoute from "./Routes/AdminRoute";
import InactiveRiders from "../Pages/Dashboard/Riders/InactiveRiders";
import DashboardHome from "../Pages/Dashboard/DashBoardHome";
import AdminParcelManagement from "../Pages/Dashboard/AdminParcelManagement/AdminParcelManagement";
import RiderDashboard from "../Pages/Dashboard/RiderDashboard/RiderDashboard";
import RiderRoute from "./Routes/RiderRoute";
import RiderForm from "../Pages/Dashboard/Riders/RiderForm";
import MyApplication from "../Pages/Dashboard/Riders/MyApplications";
import RiderEarnings from "../Pages/Dashboard/RiderDashboard/RiderEarnings";
import TrackParcel from "../Pages/TrackParcel/TrackParcel";
import AdminTracking from "../Pages/Dashboard/AdminTracking/AdminTracking";
import RiderDeliveries from "../Pages/Dashboard/RiderDashboard/RiderDeliveries";
// import TrackParcel from "../Pages/TrackParcel/TrackParcel"; // Add this import
// import About from "../Pages/About/About"; // Add this import
// import Contact from "../Pages/Contact/Contact"; // Add this import
// import Pricing from "../Pages/Pricing/Pricing"; // Add this import
// import Blog from "../Pages/Blog/Blog"; // Add this import
// import Terms from "../Pages/Terms/Terms"; // Add this import
// import Privacy from "../Pages/Privacy/Privacy"; // Add this import

export const router = createBrowserRouter([
    // Main Layout Routes
    {
        path: "/",
        Component: RootLayout,
        errorElement: <ErrorPage />,
        children: [
            { index: true, Component: HomePage },
            { path: "faq", Component: FAQPage },
            { path: "track/:trackingId", Component: TrackParcel }, // Add this

            // { path: "about", Component: About },
            // { path: "contact", Component: Contact },
            // { path: "pricing", Component: Pricing },
            // { path: "blog", Component: Blog },
            // { path: "terms", Component: Terms },
            // { path: "privacy", Component: Privacy },
            // { path: "track/:trackingId", Component: TrackParcel }, // Public tracking page
            {
                path: 'coverage',
                Component: Coverage,
                loader: () => fetch('/warehouses.json').then(res => res.json())
            },
            {
                path: 'send-parcel',
                element: <PrivateRoutes><SendParcel /></PrivateRoutes>
            },
            {
                path: 'become-rider',
                element: <PrivateRoutes><RiderForm /></PrivateRoutes>
            },
        ],
    },

    // Authentication Routes
    {
        path: "/",
        Component: AuthLayout,
        errorElement: <ErrorPage />,
        children: [
            { path: "signin", Component: Signin },
            { path: "signup", Component: Signup },
        ],
    },

    // Dashboard Routes
    {
        path: 'dashboard',
        element: <PrivateRoutes><DashboardLayout /></PrivateRoutes>,
        children: [
            // User routes - accessible by all authenticated users
            { index: true, element: <DashboardHome /> },
            { path: 'my-parcel', element: <MyParcel /> },
            { path: 'payment-history', element: <PaymentHistory /> },
            { path: 'payment/:parcelId', element: <Payment /> },
            { path: 'my-application', element: <MyApplication /> },

            // Admin routes - protected by AdminRoute

            { path: 'admin', element: <AdminRoute><AdminDashboardHome /></AdminRoute> },
            { path: 'admin/riders/pending', element: <AdminRoute><PendingRiders /></AdminRoute> },
            { path: 'admin/riders/active', element: <AdminRoute><ActiveRiders /></AdminRoute> },
            { path: 'admin/riders/inactive', element: <AdminRoute><InactiveRiders /></AdminRoute> },
            { path: 'admin/parcels', element: <AdminRoute><AdminParcelManagement /></AdminRoute> },
            { path: 'admin/dashboard', element: <AdminRoute><AdminDashboardHome /></AdminRoute> },
            { path: 'admin/tracking', element: <AdminRoute><AdminTracking /></AdminRoute> },


            {
                path: 'rider',
                element: <RiderRoute><RiderDashboard /></RiderRoute>,
            },
            {
                path: 'rider/rider-deliveries',
                element: <RiderRoute><RiderDeliveries /></RiderRoute>,
            },
            {
                path: 'rider/my-earnings',
                element: <RiderRoute><RiderEarnings /></RiderRoute>,
            }

        ],
    },

    // Error Routes
    {
        path: '/forbidden',
        element: <Forbidden />,
    },
    {
        path: '*',
        element: <ErrorPage />,
    },
]);