// src/components/Loading/Loading.jsx
import { useState, useEffect } from "react";
import { motion } from "motion/react";

// Import your logo - update the path as needed
import Logo from "../../assets/logo.png"; // Update this path to your actual logo

const Loading = ({ message = "Loading...", fullScreen = true, size = "lg" }) => {
    const [loadingText, setLoadingText] = useState("");
    const [dots, setDots] = useState("");

    const sizeClasses = {
        sm: "w-16 h-16",
        md: "w-24 h-24",
        lg: "w-32 h-32",
        xl: "w-48 h-48"
    };

    // Animated dots effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev.length >= 3) return "";
                return prev + ".";
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Typewriter effect for message
    useEffect(() => {
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
            if (currentIndex <= message.length) {
                setLoadingText(message.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);

        return () => clearInterval(typeInterval);
    }, [message]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
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
                damping: 12
            }
        }
    };

    const logoVariants = {
        initial: { scale: 0, rotate: 0 },
        animate: {
            scale: [0, 1.2, 1],
            rotate: [0, 360, 720],
            transition: {
                scale: {
                    duration: 1.5,
                    times: [0, 0.7, 1],
                    repeat: Infinity,
                    repeatDelay: 1
                },
                rotate: {
                    duration: 2,
                    ease: "linear",
                    repeat: Infinity
                }
            }
        },
        pulse: {
            scale: [1, 1.1, 1],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5
            }
        }
    };

    const ringVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 3,
                ease: "linear",
                repeat: Infinity
            }
        }
    };

    const particleVariants = {
        animate: (i) => ({
            y: [-20, 20, -20],
            x: [0, i % 2 === 0 ? 10 : -10, 0],
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 1.5 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.1
            }
        })
    };

    const loadingBarVariants = {
        initial: { width: "0%" },
        animate: {
            width: ["0%", "100%", "0%"],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const LoadingContent = () => (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center space-y-8"
        >
            {/* Animated Rings */}
            <div className="relative">
                {/* Outer Ring */}
                <motion.div
                    variants={ringVariants}
                    animate="animate"
                    className={`absolute inset-0 border-4 border-primary/20 rounded-full ${sizeClasses[size]}`}
                    style={{
                        transformOrigin: "center"
                    }}
                />

                {/* Middle Ring */}
                <motion.div
                    variants={ringVariants}
                    animate="animate"
                    className={`absolute inset-0 border-4 border-primary/40 rounded-full ${sizeClasses[size]}`}
                    style={{
                        transformOrigin: "center",
                        animationDelay: "0.5s"
                    }}
                />

                {/* Logo Container */}
                <motion.div
                    variants={logoVariants}
                    initial="initial"
                    animate="animate"
                    className={`relative ${sizeClasses[size]} flex items-center justify-center`}
                >
                    {/* Logo with pulse effect */}
                    <motion.div
                        variants={logoVariants}
                        animate="pulse"
                        className="w-full h-full flex items-center justify-center"
                    >
                        <img
                            src={Logo}
                            alt="Logo"
                            className="w-3/4 h-3/4 object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E";
                            }}
                        />
                    </motion.div>

                    {/* Floating Particles */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={particleVariants}
                            animate="animate"
                            className="absolute w-2 h-2 bg-primary rounded-full"
                            style={{
                                top: `${Math.sin(i * Math.PI / 4) * 50}%`,
                                left: `${Math.cos(i * Math.PI / 4) * 50}%`,
                            }}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Loading Text */}
            <motion.div variants={itemVariants} className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-primary">
                    {loadingText}
                    <span className="inline-block w-4">{dots}</span>
                </h3>
                <p className="text-base-content/70 text-sm max-w-md">
                    Please wait while we prepare your experience
                </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div variants={itemVariants} className="w-64">
                <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                    <motion.div
                        variants={loadingBarVariants}
                        initial="initial"
                        animate="animate"
                        className="h-full bg-linear-to-r from-primary via-secondary to-primary"
                    />
                </div>
                <div className="flex justify-between text-xs text-base-content/50 mt-2">
                    <span>0%</span>
                    <span>Loading</span>
                    <span>100%</span>
                </div>
            </motion.div>

            {/* Loading Stats */}
            <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-4 text-center"
            >
                {[
                    { label: "Speed", value: "99%", color: "text-success" },
                    { label: "Quality", value: "100%", color: "text-primary" },
                    { label: "Secure", value: "✓", color: "text-secondary" }
                ].map((stat, index) => (
                    <div key={index} className="space-y-1">
                        <div className={`text-lg font-bold ${stat.color}`}>
                            {stat.value}
                        </div>
                        <div className="text-xs text-base-content/50">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Animated Tips */}
            <motion.div
                variants={itemVariants}
                className="text-center space-y-2"
            >
                <p className="text-sm text-base-content/60 italic">
                    "Good things come to those who wait"
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-base-content/50">
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                </div>
            </motion.div>
        </motion.div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 bg-base-100 flex items-center justify-center">
                <LoadingContent />
            </div>
        );
    }

    return (
        <div className="relative">
            <LoadingContent />
        </div>
    );
};

// Optional: Create a smaller version for inline loading
export const InlineLoading = ({ size = "sm", message = "" }) => {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16"
    };

    return (
        <div className="flex items-center justify-center space-x-3">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`relative ${sizeClasses[size]}`}
            >
                <div className={`absolute inset-0 border-2 border-primary/20 rounded-full ${sizeClasses[size]}`}></div>
                <div className={`absolute inset-0 border-2 border-primary border-t-transparent rounded-full ${sizeClasses[size]}`}></div>
                <img
                    src={Logo}
                    alt="Logo"
                    className="w-1/2 h-1/2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain"
                />
            </motion.div>
            {message && (
                <span className="text-base-content/70">{message}</span>
            )}
        </div>
    );
};

// Optional: Create a page loading wrapper
// eslint-disable-next-line react-refresh/only-export-components
export const withLoading = (Component) => {
    return function WithLoadingComponent({ isLoading, ...props }) {
        if (isLoading) {
            return <Loading />;
        }
        return <Component {...props} />;
    };
};

export default Loading;