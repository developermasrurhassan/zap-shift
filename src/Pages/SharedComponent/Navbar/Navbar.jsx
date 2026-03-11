import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import ZapShiftLogo from "../Logo/ZapShiftLogo";
import { motion } from "motion/react";
import { FaArrowUp } from "react-icons/fa";
import { IoMenuSharp } from "react-icons/io5";
import useAuth from "../../../Hooks/useAuth";

const Navbar = () => {

    const { user, logOut } = useAuth();
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = (
        <>
            <li><NavLink to="/about-us">About Us</NavLink></li>
            <li><NavLink to="/services">Services</NavLink></li>
            <li><NavLink to="/coverage">Coverage</NavLink></li>
            <li><NavLink to="/send-parcel">Send a Parcel</NavLink></li>
            <li><NavLink to="/become-rider">Become a Rider</NavLink></li>

            <li><NavLink to="/pricing">Pricing</NavLink></li>
            <li><NavLink to="/blog">Blog</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>

            {user && (
                <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            )}
        </>
    );

    return (

        <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`w-full z-50 transition-all duration-300 
      ${isSticky
                    ? "fixed top-0 left-0 backdrop-blur-md bg-white/80 shadow-md py-3"
                    : "relative py-8"
                }`}
        >

            <div className="navbar max-w-7xl mx-auto px-4">

                {/* LEFT */}
                <div className="navbar-start">

                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <IoMenuSharp className="w-6 h-6" />
                        </div>

                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow bg-base-100 rounded-box w-52"
                        >
                            {navLinks}
                        </ul>
                    </div>

                    <Link to="/">
                        <ZapShiftLogo />
                    </Link>

                </div>

                {/* CENTER */}
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {navLinks}
                    </ul>
                </div>

                {/* RIGHT */}
                <div className="navbar-end gap-2">

                    {user ? (
                        <button
                            onClick={logOut}
                            className="font-bold rounded-xl btn btn-outline border-primary btn-sm md:btn-lg border-2 hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"
                        >
                            Sign Out
                        </button>
                    ) : (

                        <div className="flex items-center gap-2">

                            <Link
                                to="/signin"
                                className="font-bold rounded-xl btn btn-outline border-primary btn-sm md:btn-lg border-2 hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"
                            >
                                Sign In
                            </Link>

                            <Link
                                to="/signup"
                                className="font-bold rounded-xl btn btn-outline border-primary btn-sm md:btn-lg border-2 hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"
                            >
                                Sign Up
                            </Link>

                            <Link
                                to="/signup"
                                className="btn bg-black text-white hover:bg-transparent hover:text-black border-2 rounded-full w-12 h-12 flex items-center justify-center"
                            >
                                <FaArrowUp className="rotate-45" />
                            </Link>

                        </div>
                    )}

                </div>

            </div>

        </motion.div>

    );
};

export default Navbar;