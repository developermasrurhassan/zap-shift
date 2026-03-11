// src/Pages/ErrorPage/ErrorPage.jsx
import { useRouteError, isRouteErrorResponse, Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaExclamationTriangle,
    FaHome,
    FaRedo,
    FaEnvelope,
    FaArrowLeft,
    FaBug,
    FaServer,
    FaWifi,
    FaShieldAlt,
    FaRobot,
    FaCode
} from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import logoImage from '../../assets/logo.png';

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    const errorConfig = {
        404: {
            title: '404',
            subtitle: 'Page Not Found',
            message: 'The page you are looking for has vanished into the digital void.',
            color: 'from-yellow-500 to-orange-500',
            icon: FaExclamationTriangle,
            solutions: ['Check the URL', 'Go back home', 'Search the site']
        },
        500: {
            title: '500',
            subtitle: 'Server Error',
            message: 'Our servers are taking a coffee break. We\'ll be back shortly.',
            color: 'from-red-500 to-pink-500',
            icon: FaServer,
            solutions: ['Refresh the page', 'Try again later', 'Contact support']
        },
        403: {
            title: '403',
            subtitle: 'Access Denied',
            message: 'You don\'t have permission to access this area. It\'s top secret!',
            color: 'from-purple-500 to-indigo-500',
            icon: FaShieldAlt,
            solutions: ['Verify credentials', 'Request access', 'Go back']
        },
        default: {
            title: 'Oops!',
            subtitle: 'Something Went Wrong',
            message: 'An unexpected error occurred. Our engineers have been notified.',
            color: 'from-blue-500 to-cyan-500',
            icon: FaBug,
            solutions: ['Refresh page', 'Go home', 'Contact support']
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100,
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Particle Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: `rgba(59, 130, 246, ${Math.random() * 0.3})`
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();
    }, []);

    const getErrorDetails = () => {
        if (isRouteErrorResponse(error)) {
            return errorConfig[error.status] || errorConfig.default;
        }
        return errorConfig.default;
    };

    const details = getErrorDetails();
    const Icon = details.icon;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
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

    return (
        <div className="relative min-h-screen bg-black overflow-hidden" ref={containerRef}>
            {/* Particle Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Animated Background */}
            <div className="absolute inset-0">
                <motion.div
                    animate={{
                        background: [
                            `radial-linear(circle at ${mousePosition.x}% ${mousePosition.y}%, #1a1a1a, #000)`,
                            `radial-linear(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, #1a1a1a, #000)`,
                            `radial-linear(circle at ${mousePosition.x}% ${mousePosition.y}%, #1a1a1a, #000)`
                        ]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity
                    }}
                    className="absolute inset-0"
                />

                {/* Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-linear(rgba(255,255,255,0.1) 1px, transparent 1px),
                                          linear-linear(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />

                {/* Floating Orbs */}
                <motion.div
                    animate={{
                        x: mousePosition.x * 2,
                        y: mousePosition.y * 2,
                    }}
                    className="absolute w-125 h-125 bg-linear-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"
                    style={{
                        left: `${mousePosition.x}%`,
                        top: `${mousePosition.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            </div>

            {/* Main Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 min-h-screen flex items-center justify-center p-4"
            >
                <div className="max-w-6xl w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - 3D Error Display */}
                        <motion.div
                            variants={itemVariants}
                            className="relative"
                            onHoverStart={() => setIsHovering(true)}
                            onHoverEnd={() => setIsHovering(false)}
                        >
                            {/* 3D Cube */}
                            <div className="relative perspective-1000">
                                <motion.div
                                    animate={{
                                        rotateX: isHovering ? 360 : 0,
                                        rotateY: isHovering ? 360 : 0,
                                    }}
                                    transition={{
                                        duration: 2,
                                        ease: "easeInOut"
                                    }}
                                    className="relative w-96 h-96 mx-auto"
                                    style={{
                                        transformStyle: "preserve-3d"
                                    }}
                                >
                                    {/* Cube Faces */}
                                    {[...Array(6)].map((_, i) => {
                                        const colors = [
                                            "from-red-500 to-yellow-500",
                                            "from-yellow-500 to-green-500",
                                            "from-green-500 to-blue-500",
                                            "from-blue-500 to-purple-500",
                                            "from-purple-500 to-pink-500",
                                            "from-pink-500 to-red-500"
                                        ];

                                        const transforms = [
                                            "rotateY(0deg) translateZ(192px)",
                                            "rotateY(90deg) translateZ(192px)",
                                            "rotateY(180deg) translateZ(192px)",
                                            "rotateY(-90deg) translateZ(192px)",
                                            "rotateX(90deg) translateZ(192px)",
                                            "rotateX(-90deg) translateZ(192px)"
                                        ];

                                        return (
                                            <motion.div
                                                key={i}
                                                className={`absolute inset-0 bg-linear-to-br ${colors[i]} rounded-3xl border-2 border-white/20`}
                                                style={{
                                                    transform: transforms[i],
                                                    boxShadow: "0 0 50px rgba(0,0,0,0.5)"
                                                }}
                                            >
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-8xl font-black text-white/30">
                                                        {details.title}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>

                                {/* Glow Effect */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity
                                    }}
                                    className={`absolute inset-0 bg-linear-to-r ${details.color} rounded-full blur-3xl -z-10`}
                                />
                            </div>

                            {/* Floating Numbers */}
                            <div className="absolute top-0 left-0 font-mono text-sm text-white/20">
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        ERROR_{Math.floor(Math.random() * 9999)}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right Side - Content */}
                        <motion.div variants={itemVariants} className="text-white space-y-8">
                            {/* Logo */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="w-20 h-20 mb-8"
                            >
                                <img
                                    src={logoImage}
                                    alt="Logo"
                                    className="w-full h-full object-contain"
                                />
                            </motion.div>

                            {/* Error Code with Glitch */}
                            <div className="relative">
                                <motion.h1
                                    animate={{
                                        textShadow: [
                                            "2px 2px 0 #ff0000",
                                            "-2px -2px 0 #00ff00",
                                            "2px -2px 0 #0000ff",
                                            "2px 2px 0 #ff0000"
                                        ]
                                    }}
                                    transition={{
                                        duration: 0.2,
                                        repeat: Infinity
                                    }}
                                    className={`text-9xl font-black bg-linear-to-r ${details.color} bg-clip-text text-transparent`}
                                >
                                    {details.title}
                                </motion.h1>
                            </div>

                            {/* Subtitle */}
                            <motion.h2
                                variants={itemVariants}
                                className="text-4xl font-bold text-white"
                            >
                                {details.subtitle}
                            </motion.h2>

                            {/* Message */}
                            <motion.p
                                variants={itemVariants}
                                className="text-xl text-gray-300 leading-relaxed"
                            >
                                {details.message}
                            </motion.p>

                            {/* Solutions Grid */}
                            <motion.div
                                variants={itemVariants}
                                className="grid grid-cols-3 gap-4 py-4"
                            >
                                {details.solutions.map((solution, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ y: -5 }}
                                        className="p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 text-center"
                                    >
                                        <span className="text-sm text-gray-300">{solution}</span>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-wrap gap-4"
                            >
                                <Link to="/">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`group relative px-8 py-4 bg-linear-to-r ${details.color} rounded-xl text-white font-semibold overflow-hidden`}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <FaHome />
                                            Go Home
                                            {countdown > 0 && (
                                                <span className="ml-2 text-sm opacity-75">
                                                    ({countdown}s)
                                                </span>
                                            )}
                                        </span>
                                        <motion.div
                                            className="absolute inset-0 bg-white/20"
                                            initial={{ x: "-100%" }}
                                            whileHover={{ x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.button>
                                </Link>

                                <button onClick={() => navigate(-1)}>
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 bg-white/10 backdrop-blur-lg rounded-xl text-white font-semibold border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
                                    >
                                        <FaArrowLeft />
                                        Go Back
                                    </motion.button>
                                </button>

                                <button onClick={() => window.location.reload()}>
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 bg-white/10 backdrop-blur-lg rounded-xl text-white font-semibold border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
                                    >
                                        <FaRedo />
                                        Refresh
                                    </motion.button>
                                </button>
                            </motion.div>

                            {/* Error Details (if available) */}
                            {error instanceof Error && (
                                <motion.div
                                    variants={itemVariants}
                                    className="p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10"
                                >
                                    <div className="flex items-start gap-3">
                                        <FaCode className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-sm font-mono text-gray-300 break-all">
                                                {error.message}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Error ID: {Math.random().toString(36).substring(7).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Contact Support */}
                            <motion.div
                                variants={itemVariants}
                                className="pt-8 border-t border-white/10"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 bg-linear-to-r ${details.color} rounded-full flex items-center justify-center`}>
                                            <FaEnvelope className="text-white text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Need help?</p>
                                            <p className="text-white font-semibold">support@zapshift.com</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"
                                    >
                                        <FaRobot />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Auto-redirect indicator */}
            {countdown > 0 && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-8 right-8 bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
                >
                    <p className="text-sm text-gray-300">
                        Redirecting to home in <span className="text-white font-bold">{countdown}s</span>
                    </p>
                    <div className="w-full h-1 bg-white/20 mt-2 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 10, ease: "linear" }}
                            className={`h-full bg-linear-to-r ${details.color}`}
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ErrorPage;