import React from 'react';
import { Link, NavLink } from 'react-router';
import ZapShiftLogo from '../Logo/ZapShiftLogo';
import { motion } from 'motion/react';
import { FaArrowUp } from 'react-icons/fa';
import { IoMenuSharp } from 'react-icons/io5';
import useAuth from '../../../Hooks/useAuth';

const Navbar = () => {
    const { user, logOut } = useAuth();

    const navLinks = <>

        <li> <NavLink to={'/services'}>Services</NavLink></li>

        <li>  <NavLink to={'/coverage'}>Coverage</NavLink></li>
        <li>  <NavLink to={'/send-parcel'}>Send a Parcel</NavLink></li>
        <li>  <NavLink to={'/about-us'}>About Us</NavLink></li>
        <li>  <NavLink to={'/pricing'}>Pricing</NavLink></li>
        <li> <NavLink to={'/blog'}>Blog</NavLink></li>
        <li> <NavLink to={'/contact'}>Contact</NavLink></li>

        {
            user ?
                <li> <NavLink to={'/dashboard'}>Dashboard</NavLink></li>
                :
                <li> <NavLink to={'/signin'}>Signin</NavLink></li>
        }

    </>

    return (
        <div className="navbar items-end py-8 ">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <IoMenuSharp className='w-5 h-5' />

                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {navLinks}
                    </ul>
                </div>
                <Link to={'/'} >
                    <ZapShiftLogo></ZapShiftLogo>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navLinks}
                </ul>
            </div>
            <div className="navbar-end items-end  ">
                {
                    user ?

                        (<button onClick={() => logOut()} className="font-bold rounded-xl btn btn-outline border-primary btn-lg px-7 border-2 hover:bg-primary hover:text-white mr-1 transition-all duration-300 transform hover:-translate-y-1">
                            Sign Out

                        </button>)


                        :

                        (<motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-center flex  items-end justify-center"
                        >
                            <Link to={'/signin'} className="font-bold rounded-xl btn btn-outline border-primary btn-lg px-7 border-2 hover:bg-primary hover:text-white mr-1 transition-all duration-300 transform hover:-translate-y-1">
                                Signin

                            </Link>

                            <Link className="font-bold rounded-xl btn btn-outline border-primary btn-lg px-7 border-2 hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                                Sign Up

                            </Link>
                            <Link
                                to={'/signup'}
                                className='btn bg-black text-amber-50 border-2  hover:border-primary hover:bg-transparent hover:text-black transition-all duration-300 transform hover:-translate-y-1 rounded-full w-16 h-16 flex items-center justify-center'
                            >
                                <FaArrowUp className="group-hover:translate-x-1 transition-transform rotate-45" />
                            </Link>

                        </motion.div>)
                }



            </div>
        </div>
    );
};

export default Navbar;