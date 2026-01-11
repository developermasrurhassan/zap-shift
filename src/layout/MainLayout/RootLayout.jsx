import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../../Pages/SharedComponent/Navbar/Navbar';
import Footer from '../../Pages/SharedComponent/Footer/Footer';

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet />
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;