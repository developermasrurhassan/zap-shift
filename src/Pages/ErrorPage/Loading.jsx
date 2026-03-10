// src/components/Loading/Loading.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

// Import your logo - update this path
import logoImage from '../../assets/logo.png';

const Loading = ({
    message = "Loading Experience",
    fullScreen = true,
    size = "lg",
    progress,
    type = "default"
}) => {
    const [loadingText, setLoadingText] = useState("");
    const [progressValue, setProgressValue] = useState(0);
    const canvasRef = useRef(null);
    const mousePosition = useRef({ x: 0, y: 0 });

    const sizeClasses = {
        sm: "w-32 h-32",
        md: "w-48 h-48",
        lg: "w-64 h-64",
        xl: "w-80 h-80"
    };

    // 3D Sphere Animation
    useEffect(() => {
        if (type !== 'sphere') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
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

                // Mouse interaction
                const dx = mousePosition.current.x - p.x;
                const dy = mousePosition.current.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    const angle = Math.atan2(dy, dx);
                    p.x -= Math.cos(angle) * 2;
                    p.y -= Math.sin(angle) * 2;
                }
            });

            requestAnimationFrame(animate);
        };

        animate();

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mousePosition.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }, [type]);

    // Typing effect
    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index <= message.length) {
                setLoadingText(message.substring(0, index));
                index++;
            } else {
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [message]);

    // Progress simulation
    useEffect(() => {
        if (progress !== undefined) {
            setProgressValue(progress);
        } else {
            const interval = setInterval(() => {
                setProgressValue(prev => {
                    if (prev >= 100) return 0;
                    return prev + 1;
                });
            }, 50);

            return () => clearInterval(interval);
        }
    }, [progress]);

    const spinnerVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const LoadingContent = () => (
        <div className="relative">
            {/* Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/30 rounded-full"
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: Math.random() * 100 + "%",
                        }}
                        animate={{
                            y: [null, "-100%"],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Main Loading Animation */}
            <div className="relative flex flex-col items-center justify-center space-y-8">
                {/* 3D Rotating Cube */}
                <div className="relative perspective-1000">
                    <motion.div
                        animate={{
                            rotateX: 360,
                            rotateY: 360,
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="relative w-64 h-64"
                        style={{
                            transformStyle: "preserve-3d"
                        }}
                    >
                        {/* Cube Faces */}
                        {[...Array(6)].map((_, i) => {
                            const faces = [
                                { transform: "rotateY(0deg) translateZ(32px)", color: "from-blue-500/20 to-purple-500/20" },
                                { transform: "rotateY(90deg) translateZ(32px)", color: "from-purple-500/20 to-pink-500/20" },
                                { transform: "rotateY(180deg) translateZ(32px)", color: "from-pink-500/20 to-red-500/20" },
                                { transform: "rotateY(-90deg) translateZ(32px)", color: "from-red-500/20 to-orange-500/20" },
                                { transform: "rotateX(90deg) translateZ(32px)", color: "from-green-500/20 to-blue-500/20" },
                                { transform: "rotateX(-90deg) translateZ(32px)", color: "from-yellow-500/20 to-green-500/20" }
                            ];

                            return (
                                <motion.div
                                    key={i}
                                    className={`absolute inset-0 bg-gradient-to-br ${faces[i].color} rounded-2xl border border-white/10 backdrop-blur-sm`}
                                    style={{
                                        transform: faces[i].transform,
                                        boxShadow: "0 0 30px rgba(0,0,0,0.3)"
                                    }}
                                >
                                    {/* Logo on each face */}
                                    <div className="w-full h-full flex items-center justify-center">
                                        <img
                                            src={logoImage}
                                            alt="Logo"
                                            className="w-16 h-16 object-contain opacity-30"
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Inner Glow */}
                    <motion.div
                        variants={pulseVariants}
                        animate="animate"
                        className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary rounded-full blur-3xl opacity-30"
                    />
                </div>

                {/* Loading Text with Glitch */}
                <div className="relative">
                    <motion.h3
                        animate={{
                            textShadow: [
                                "0 0 10px #fff",
                                "0 0 20px #0ff",
                                "0 0 30px #f0f",
                                "0 0 10px #fff"
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity
                        }}
                        className="text-3xl font-bold text-white"
                    >
                        {loadingText}
                        <motion.span
                            animate={{
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity
                            }}
                            className="inline-block w-1 h-8 bg-white ml-1"
                        />
                    </motion.h3>

                    {/* Glitch Effect */}
                    <motion.div
                        animate={{
                            x: [-2, 2, -2],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{
                            duration: 0.2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        className="absolute top-0 left-0 text-3xl font-bold text-red-500"
                    >
                        {loadingText}
                    </motion.div>
                    <motion.div
                        animate={{
                            x: [2, -2, 2],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{
                            duration: 0.2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: 0.1
                        }}
                        className="absolute top-0 left-0 text-3xl font-bold text-blue-500"
                    >
                        {loadingText}
                    </motion.div>
                </div>

                {/* Circular Progress */}
                <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            className="stroke-white/10"
                            strokeWidth="8"
                            fill="none"
                        />
                        <motion.circle
                            cx="96"
                            cy="96"
                            r="88"
                            className="stroke-primary"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: progressValue / 100 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                strokeDasharray: "553",
                                strokeDashoffset: 553
                            }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{progressValue}%</span>
                    </div>
                </div>

                {/* Loading Tips */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center space-y-2"
                >
                    <p className="text-gray-400 text-sm">
                        {tips[Math.floor(progressValue / 10) % tips.length]}
                    </p>
                    <div className="flex justify-center gap-1">
                        {[...Array(10)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full"
                                animate={{
                                    scale: i === Math.floor(progressValue / 10) ? [1, 1.5, 1] : 1,
                                    backgroundColor: i <= Math.floor(progressValue / 10)
                                        ? "#3b82f6"
                                        : "#374151"
                                }}
                                transition={{
                                    duration: 0.5
                                }}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Particle Sphere Canvas */}
                {type === 'sphere' && (
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={400}
                        className="absolute inset-0 w-full h-full"
                    />
                )}
            </div>
        </div>
    );

    const tips = [
        "Securing your connection...",
        "Loading awesome content...",
        "Almost there...",
        "Preparing your dashboard...",
        "Optimizing experience...",
        "Loading animations...",
        "Connecting to servers...",
        "Almost ready...",
        "Final touches...",
        "Welcome back!"
    ];

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <motion.div
                        animate={{
                            background: [
                                "radial-gradient(circle at 20% 20%, #1a1a1a, #000)",
                                "radial-gradient(circle at 80% 80%, #1a1a1a, #000)",
                                "radial-gradient(circle at 20% 20%, #1a1a1a, #000)"
                            ]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity
                        }}
                        className="absolute inset-0"
                    />

                    {/* Grid Overlay */}
                    <div className="absolute inset-0"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                                              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                            backgroundSize: '50px 50px'
                        }}
                    />
                </div>

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

// Inline Loading Component
export const InlineLoading = ({ size = "md", message = "Loading..." }) => {
    const sizeMap = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16"
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
        >
            <div className="relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className={`${sizeMap[size]} border-4 border-primary/20 border-t-primary rounded-full`}
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 border-4 border-primary/30 rounded-full"
                />
            </div>
            {message && (
                <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-gray-300"
                >
                    {message}
                </motion.span>
            )}
        </motion.div>
    );
};

// Page Transition Loading
export const PageLoading = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
        <motion.div
            animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360, 0]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full"
        />
    </motion.div>
);

export default Loading;