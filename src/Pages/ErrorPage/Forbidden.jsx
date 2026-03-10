// src/Pages/ErrorPage/Forbidden.jsx
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
    FaLock,
    FaArrowLeft,
    FaHome,
    FaShieldAlt,
    FaExclamationTriangle,
    FaEnvelope,
    FaRobot,
    FaLockOpen,
    FaKey
} from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';

const Forbidden = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const containerRef = useRef(null);

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

    // Matrix rain effect for background
    useEffect(() => {
        const canvas = document.getElementById('matrixCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");

        const fontSize = 10;
        const columns = canvas.width / fontSize;

        const drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 35);
        return () => clearInterval(interval);
    }, []);

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

    const glowVariants = {
        animate: {
            boxShadow: [
                "0 0 20px rgba(239, 68, 68, 0.3)",
                "0 0 40px rgba(239, 68, 68, 0.5)",
                "0 0 20px rgba(239, 68, 68, 0.3)"
            ],
            scale: [1, 1.02, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
            }
        }
    };

    const floatingIcons = [
        { Icon: FaLock, delay: 0, x: 10, y: 10 },
        { Icon: FaShieldAlt, delay: 0.5, x: -15, y: -5 },
        { Icon: FaKey, delay: 1, x: 5, y: -15 },
        { Icon: FaLockOpen, delay: 1.5, x: -10, y: 15 }
    ];

    return (
        <div className="relative min-h-screen bg-black overflow-hidden" ref={containerRef}>
            {/* Matrix Background */}
            <canvas
                id="matrixCanvas"
                className="absolute inset-0 w-full h-full opacity-20"
                style={{
                    filter: 'blur(1px)'
                }}
            />

            {/* Animated Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: mousePosition.x * 2,
                        y: mousePosition.y * 2,
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 0.5 }}
                    className="absolute w-125 h-125 bg-linear-to-r from-red-500/20 to-red-600/20 rounded-full blur-3xl"
                    style={{
                        left: `${mousePosition.x}%`,
                        top: `${mousePosition.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                />
                <motion.div
                    animate={{
                        x: -mousePosition.x,
                        y: -mousePosition.y,
                    }}
                    className="absolute w-150 h-150 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
                    style={{
                        right: '10%',
                        bottom: '10%'
                    }}
                />
            </div>

            {/* Floating Icons */}
            {floatingIcons.map(({ Icon, delay, x, y }, index) => (
                <motion.div
                    key={index}
                    className="absolute text-white/10 text-6xl z-0"
                    initial={{ x: 0, y: 0 }}
                    animate={{
                        x: [x, -x, x],
                        y: [y, -y, y],
                    }}
                    transition={{
                        duration: 5,
                        delay,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    style={{
                        left: `${20 + index * 20}%`,
                        top: `${20 + index * 15}%`,
                    }}
                >
                    <Icon />
                </motion.div>
            ))}

            {/* Main Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 min-h-screen flex items-center justify-center p-4"
            >
                <div className="max-w-6xl w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - 3D Lock Animation */}
                        <motion.div
                            variants={itemVariants}
                            className="relative"
                            onHoverStart={() => setIsHovering(true)}
                            onHoverEnd={() => setIsHovering(false)}
                        >
                            <motion.div
                                animate={glowVariants.animate}
                                className="relative w-96 h-96 mx-auto"
                            >
                                {/* 3D Lock Model */}
                                <div className="absolute inset-0 bg-linear-to-br from-red-500 to-red-700 rounded-3xl transform rotate-45 shadow-2xl">
                                    <div className="absolute inset-2 bg-black/20 rounded-2xl backdrop-blur-sm" />
                                </div>

                                <motion.div
                                    animate={{
                                        rotateY: isHovering ? 180 : 0,
                                        scale: isHovering ? 1.1 : 1,
                                    }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <FaLock className="text-white text-8xl" />
                                </motion.div>

                                {/* Scanning Line Effect */}
                                <motion.div
                                    animate={{
                                        y: [-200, 200],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        repeatType: "loop"
                                    }}
                                    className="absolute w-full h-1 bg-linear-to-r from-transparent via-red-500 to-transparent blur-sm"
                                />

                                {/* Particle Effects */}
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1 h-1 bg-red-400 rounded-full"
                                        initial={{
                                            x: Math.random() * 384,
                                            y: Math.random() * 384,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            y: [null, -50],
                                            opacity: [0, 1, 0],
                                            scale: [0, 1, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            delay: i * 0.1,
                                            repeat: Infinity,
                                            repeatDelay: Math.random() * 2
                                        }}
                                    />
                                ))}
                            </motion.div>

                            {/* Floating Numbers (Binary) */}
                            <div className="absolute top-0 left-0 text-red-500/30 font-mono text-sm">
                                {[...Array(10)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        10101010
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right Side - Content */}
                        <motion.div variants={itemVariants} className="text-white space-y-8">
                            {/* Error Code with Glitch Effect */}
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
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    className="text-9xl font-black text-white relative"
                                >
                                    403
                                    <motion.span
                                        animate={{
                                            opacity: [0, 1, 0],
                                        }}
                                        transition={{
                                            duration: 0.1,
                                            repeat: Infinity,
                                        }}
                                        className="absolute top-0 left-0 text-red-500"
                                    >
                                        403
                                    </motion.span>
                                    <motion.span
                                        animate={{
                                            opacity: [0, 1, 0],
                                        }}
                                        transition={{
                                            duration: 0.15,
                                            repeat: Infinity,
                                            delay: 0.05
                                        }}
                                        className="absolute top-0 left-0 text-blue-500"
                                    >
                                        403
                                    </motion.span>
                                </motion.h1>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-1 bg-linear-to-r from-red-500 via-purple-500 to-blue-500 mt-4"
                                />
                            </div>

                            {/* Title */}
                            <motion.h2
                                variants={itemVariants}
                                className="text-4xl font-bold bg-linear-to-r from-red-500 to-purple-500 bg-clip-text text-transparent"
                            >
                                Access Forbidden
                            </motion.h2>

                            {/* Description with Typewriter Effect */}
                            <motion.div
                                variants={itemVariants}
                                className="space-y-4"
                            >
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    You don't have permission to access this page. This area is restricted and requires
                                    proper authorization.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <FaExclamationTriangle className="text-yellow-500" />
                                    <span>IP: {Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}</span>
                                </div>
                            </motion.div>

                            {/* Security Badge */}
                            <motion.div
                                variants={itemVariants}
                                className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10"
                            >
                                <FaShieldAlt className="text-3xl text-green-400" />
                                <div>
                                    <p className="font-semibold text-white">Security Level: Maximum</p>
                                    <p className="text-sm text-gray-400">This incident has been logged</p>
                                </div>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                variants={itemVariants}
                                className="flex flex-wrap gap-4 pt-4"
                            >
                                <Link to="/">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group relative px-8 py-4 bg-linear-to-r from-red-500 to-red-600 rounded-xl text-white font-semibold overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <FaHome />
                                            Go Home
                                        </span>
                                        <motion.div
                                            className="absolute inset-0 bg-linear-to-r from-red-600 to-red-700"
                                            initial={{ x: "100%" }}
                                            whileHover={{ x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.button>
                                </Link>

                                <Link to="/dashboard">
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 bg-white/10 backdrop-blur-lg rounded-xl text-white font-semibold border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
                                    >
                                        <FaArrowLeft />
                                        Back to Dashboard
                                    </motion.button>
                                </Link>
                            </motion.div>

                            {/* Contact Support */}
                            <motion.div
                                variants={itemVariants}
                                className="pt-8 border-t border-white/10"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                            <FaEnvelope className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Need access?</p>
                                            <p className="text-white font-semibold">security@zapshift.com</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white"
                                    >
                                        <FaRobot />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Forbidden;