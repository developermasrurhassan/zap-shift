/* eslint-disable react-hooks/purity */
// src/components/ErrorPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router';
import { FaArrowRight, FaExclamationTriangle, FaHome, FaRedo, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'motion/react'; // Install with: npm install framer-motion

// Import your logo - replace this with your actual logo import
import Logo from '../SharedComponent/Logo/ZapShiftLogo'; // Update this path

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    const errorConfig = {
        404: {
            title: '404',
            subtitle: 'Page Not Found',
            message: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
            bgColor: 'bg-white',
            textColor: 'text-primary',
            borderColor: 'border-primary',
            iconBg: 'bg-primary',
        },
        500: {
            title: '500',
            subtitle: 'Server Error',
            message: 'Something went wrong on our end. We are working to fix the issue. Please try again later.',
            bgColor: 'bg-white',
            textColor: 'text-secondary',
            borderColor: 'border-secondary',
            iconBg: 'bg-secondary',
        },
        403: {
            title: '403',
            subtitle: 'Access Denied',
            message: 'You do not have permission to access this page. Please contact the administrator if you believe this is an error.',
            bgColor: 'bg-white',
            textColor: 'text-black',
            borderColor: 'border-black',
            iconBg: 'bg-black',
        },
        default: {
            title: 'Oops!',
            subtitle: 'Something Went Wrong',
            message: 'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.',
            bgColor: 'bg-white',
            textColor: 'text-primary',
            borderColor: 'border-primary',
            iconBg: 'bg-primary',
        }
    };

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const getErrorDetails = () => {
        if (isRouteErrorResponse(error)) {
            return errorConfig[error.status] || errorConfig.default;
        }
        return errorConfig.default;
    };

    const errorDetails = getErrorDetails();
    const errorCode = isRouteErrorResponse(error) ? error.status : 'Error';
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleReload = () => {
        window.location.reload();
    };

    const ActionButton = ({ onClick, icon, label, variant }) => (
        <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
        flex items-center justify-center gap-3 px-6 py-4 rounded-full 
        transition-all duration-300 border-2
        ${variant === 'primary'
                    ? 'bg-black text-white hover:bg-transparent hover:text-black hover:border-black'
                    : 'border-black text-black hover:bg-black hover:text-white'}
        font-medium group relative overflow-hidden
      `}
        >
            <span className="relative z-10 flex items-center gap-3">
                {icon}
                <span>{label}</span>
                <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
        </motion.button>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    const logoVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.5
            }
        },
        hover: {
            scale: 1.1,
            rotate: 360,
            transition: {
                duration: 0.8
            }
        }
    };

    return (
        <div className={`min-h-screen bg-linear-to-br from-white to-gray-100 flex items-center justify-center p-4 md:p-6`}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl w-full"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={`relative ${errorDetails.bgColor} rounded-3xl shadow-lg overflow-hidden border ${errorDetails.borderColor}`}
                >
                    {/* Header with Logo */}
                    <motion.div
                        variants={itemVariants}
                        className="p-6 border-b border-gray-200"
                    >
                        <div className="flex items-center justify-center">
                            <motion.div
                                variants={logoVariants}
                                whileHover="hover"
                                className="w-16 h-16 flex items-center justify-center"
                            >
                                {/* Your Logo */}
                                <img
                                    src={Logo}
                                    alt="Logo"
                                    className="w-full h-full object-contain"

                                />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                            {/* Left Column - Logo Circle */}
                            <motion.div
                                variants={itemVariants}
                                className="flex-1 flex flex-col items-center"
                            >
                                <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-8 ${errorDetails.borderColor} flex items-center justify-center p-4 relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-linear-to-br from-white to-gray-100"></div>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                                        className="relative z-10 w-3/4 h-3/4 flex items-center justify-center"
                                    >
                                        <img
                                            src={Logo}
                                            alt="Logo"
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E";
                                            }}
                                        />
                                    </motion.div>

                                    {/* Animated border effect */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-4 border-transparent"
                                        animate={{
                                            borderColor: ['#00000000', errorDetails.textColor, '#00000000'],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                        style={{
                                            borderTopColor: 'currentColor',
                                            borderRightColor: 'currentColor'
                                        }}
                                    />
                                </div>
                            </motion.div>

                            {/* Right Column - Error Details */}
                            <motion.div
                                variants={containerVariants}
                                className="flex-1"
                            >
                                <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                                    <div className={`p-3 rounded-full ${errorDetails.iconBg} text-white`}>
                                        <FaExclamationTriangle className="text-xl" />
                                    </div>
                                    <span className={`text-sm font-bold px-4 py-2 rounded-full ${errorDetails.textColor} bg-gray-100`}>
                                        ERROR {errorCode}
                                    </span>
                                </motion.div>

                                <motion.h1
                                    variants={itemVariants}
                                    className={`text-6xl md:text-8xl font-black mb-4 ${errorDetails.textColor} tracking-tight`}
                                >
                                    {errorDetails.title}
                                </motion.h1>

                                <motion.h2
                                    variants={itemVariants}
                                    className="text-2xl md:text-3xl font-bold text-gray-800 mb-6"
                                >
                                    {errorDetails.subtitle}
                                </motion.h2>

                                <motion.p
                                    variants={itemVariants}
                                    className="text-lg text-gray-600 mb-8 leading-relaxed"
                                >
                                    {errorDetails.message}
                                </motion.p>

                                {error instanceof Error && (
                                    <motion.div
                                        variants={itemVariants}
                                        className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-xl"
                                    >
                                        <p className="text-sm font-mono text-gray-700 break-all">
                                            {errorMessage}
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>

                        {/* Action Buttons */}
                        <motion.div
                            variants={containerVariants}
                            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <motion.div variants={itemVariants}>
                                <ActionButton
                                    onClick={handleGoHome}
                                    icon={<FaHome />}
                                    label="Go Home"
                                    variant="primary"
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <ActionButton
                                    onClick={handleGoBack}
                                    icon={<FaArrowLeft />}
                                    label="Go Back"
                                    variant="secondary"
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <ActionButton
                                    onClick={handleReload}
                                    icon={<FaRedo />}
                                    label="Refresh Page"
                                    variant="secondary"
                                />
                            </motion.div>
                        </motion.div>

                        {/* Contact Support */}
                        <motion.div
                            variants={itemVariants}
                            className="mt-12 pt-8 border-t border-gray-200"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gray-100 rounded-full border border-gray-300">
                                        <FaEnvelope className="text-gray-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Need help?</p>
                                        <p className="font-semibold text-gray-800">support@yourdomain.com</p>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ x: 5 }}
                                    className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-2 group"
                                >
                                    Report this issue
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300 text-xs" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Animated Footer */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-1 ${errorDetails.iconBg} relative overflow-hidden`}
                    >
                        <motion.div
                            className="absolute top-0 left-0 w-1/3 h-full bg-white/50"
                            animate={{
                                x: ["0%", "300%"]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "loop"
                            }}
                        />
                    </motion.div>
                </motion.div>

                {/* Stats with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    {[
                        { value: "98%", label: "Uptime" },
                        { value: "24/7", label: "Support" },
                        { value: "99.9%", label: "Reliability" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-sm"
                        >
                            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Floating particles */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute w-2 h-2 ${errorDetails.iconBg} rounded-full`}
                        initial={{

                            x: Math.random() * window.innerWidth,

                            y: Math.random() * window.innerHeight,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, -30, 0],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{

                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeInOut"
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
};

export default ErrorPage;