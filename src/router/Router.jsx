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
import PaymentForm from "../Pages/Dashboard/Payment/PaymentForm";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import PendingRiders from "../Pages/Dashboard/Riders/PendingRiders";
import RiderForm from "../Pages/Dashboard/Riders/RiderForm";


export const router = createBrowserRouter([

    {
        path: "/",
        Component: RootLayout,
        errorElement: <ErrorPage />,
        children: [
            { index: true, Component: HomePage },
            { path: "faq", Component: FAQPage },
            {
                path: 'coverage', Component: Coverage,
                loader: () => fetch('/warehouses.json').then(res => res.json())
            },
            {
                path: 'send-parcel', element: <PrivateRoutes><SendParcel /></PrivateRoutes>
            },

            //  { path: "about", Component: About },


            // {
            //     path: "concerts",
            //     children: [
            //         // { index: true, Component: ConcertsHome },
            //         // { path: ":city", Component: ConcertsCity },
            //         // { path: "trending", Component: ConcertsTrending },
            //     ],
            // },
        ],
    },

    // authentication

    {
        path: "/",
        Component: AuthLayout,
        errorElement: < ErrorPage />,
        children: [
            { path: "signin", Component: Signin },
            { path: "signup", Component: Signup },
        ],
    },

    {
        path: 'dashboard',
        element: <PrivateRoutes><DashboardLayout /></PrivateRoutes>,
        children: [
            { path: 'my-parcel', Component: MyParcel },
            { path: 'payment-history', Component: PaymentHistory },
            { path: "payment/:parcelId", Component: Payment },
            { path: "become-rider", Component: RiderForm },
            { path: "pending-rider", Component: PendingRiders },

            // Add rider routes here:
            // Add this
            // { path: 'rider/active', Component: ActiveRiders },
            // { path: 'rider/inactive', Component: InactiveRiders },
        ]
    }
]);
