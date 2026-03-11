// src/components/About/About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    FaRocket,
    FaUsers,
    FaGlobe,
    FaHeart,
    FaArrowRight,
    FaQuoteRight,
    FaLinkedin,
    FaTwitter,
    FaEnvelope,
    FaMapMarkerAlt,
    FaPhone,
    FaClock,
    FaAward,
    FaBoxOpen,
    FaShippingFast,
    FaShieldAlt,
    FaCheckCircle
} from 'react-icons/fa';

const About = () => {
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    // Team members data
    const teamMembers = [
        {
            id: 1,
            name: "Alex Thompson",
            role: "CEO & Co-Founder",
            bio: "Former logistics expert with 15+ years experience",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            social: { linkedin: "#", twitter: "#", email: "#" }
        },
        {
            id: 2,
            name: "Sarah Chen",
            role: "CTO & Co-Founder",
            bio: "Tech visionary specializing in AI and tracking systems",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            social: { linkedin: "#", twitter: "#", email: "#" }
        },
        {
            id: 3,
            name: "Michael Rodriguez",
            role: "Head of Operations",
            bio: "Supply chain guru with global experience",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            social: { linkedin: "#", twitter: "#", email: "#" }
        },
        {
            id: 4,
            name: "Priya Patel",
            role: "Customer Experience Director",
            bio: "Dedicated to making every experience seamless",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
            social: { linkedin: "#", twitter: "#", email: "#" }
        }
    ];

    // Values data
    const values = [
        {
            icon: <FaRocket className="w-8 h-8" />,
            title: "Innovation First",
            description: "Pushing boundaries to revolutionize the shipping industry",
            color: "primary"
        },
        {
            icon: <FaUsers className="w-8 h-8" />,
            title: "Customer-Centric",
            description: "Every decision driven by customer value",
            color: "secondary"
        },
        {
            icon: <FaShieldAlt className="w-8 h-8" />,
            title: "Trust & Reliability",
            description: "Building relationships through transparency",
            color: "accent"
        },
        {
            icon: <FaHeart className="w-8 h-8" />,
            title: "Partnership",
            description: "Growing together with our community",
            color: "primary"
        }
    ];

    // Stats data
    const stats = [
        { value: "1M+", label: "Packages Delivered" },
        { value: "50K+", label: "Happy Customers" },
        { value: "100+", label: "Cities Covered" },
        { value: "15+", label: "Industry Awards" }
    ];

    // Timeline data
    const timeline = [
        { year: 2020, title: "The Beginning", description: "ZapShift was founded" },
        { year: 2021, title: "First Milestone", description: "Reached 10,000 deliveries" },
        { year: 2022, title: "Tech Innovation", description: "Launched AI-powered system" },
        { year: 2023, title: "Global Expansion", description: "Expanded to 20+ locations" },
        { year: 2024, title: "Industry Leader", description: "1M+ deliveries achieved" }
    ];

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
                            Welcome to ZapShift
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold mb-6"
                    >
                        We're on a Mission to
                        <span className="text-primary block mt-2">Transform Logistics</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-xl text-base-content/70 max-w-3xl mx-auto mb-10"
                    >
                        We're not just shipping packages — we're delivering the future of logistics,
                        one innovation at a time.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <button className="btn btn-primary btn-lg gap-2">
                            Start Shipping
                            <FaArrowRight />
                        </button>
                        <button className="btn btn-outline btn-lg">
                            Learn More
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-base-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-base-content/70">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-primary font-semibold text-lg mb-4 block">Our Story</span>
                            <h2 className="text-4xl font-bold mb-6">
                                From a Bold Idea to
                                <span className="text-primary block mt-2">Revolutionizing Logistics</span>
                            </h2>
                            <p className="text-lg text-base-content/70 mb-6">
                                In 2020, we set out with a simple goal: to make shipping as seamless
                                as sending a text message. Today, ZapShift powers deliveries for
                                thousands of businesses across the globe.
                            </p>
                            <p className="text-lg text-base-content/70 mb-8">
                                We combine cutting-edge technology with human-centric service to
                                create shipping experiences that delight our customers.
                            </p>

                            <div className="flex gap-4">
                                <div className="badge badge-primary badge-lg">Innovation</div>
                                <div className="badge badge-secondary badge-lg">Reliability</div>
                                <div className="badge badge-accent badge-lg">Speed</div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="card bg-primary text-primary-content">
                                <div className="card-body">
                                    <FaRocket className="text-3xl mb-2" />
                                    <h3 className="font-bold">Fast Growth</h3>
                                    <p className="text-sm">300% YoY</p>
                                </div>
                            </div>
                            <div className="card bg-secondary text-secondary-content">
                                <div className="card-body">
                                    <FaGlobe className="text-3xl mb-2" />
                                    <h3 className="font-bold">Global Reach</h3>
                                    <p className="text-sm">100+ cities</p>
                                </div>
                            </div>
                            <div className="card bg-accent text-accent-content">
                                <div className="card-body">
                                    <FaUsers className="text-3xl mb-2" />
                                    <h3 className="font-bold">Happy Clients</h3>
                                    <p className="text-sm">50K+ customers</p>
                                </div>
                            </div>
                            <div className="card bg-base-300">
                                <div className="card-body">
                                    <FaAward className="text-3xl mb-2" />
                                    <h3 className="font-bold">Awards Won</h3>
                                    <p className="text-sm">15+ industry awards</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-base-200/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            What Drives
                            <span className="text-primary block mt-2">Everything We Do</span>
                        </h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                            Our core values shape our culture and guide our decisions every day
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                variants={fadeIn}
                                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                            >
                                <div className="card-body">
                                    <div className={`w-16 h-16 rounded-xl bg-${value.color}/10 text-${value.color} flex items-center justify-center mb-4`}>
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                    <p className="text-base-content/70">{value.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            Our Journey
                            <span className="text-primary block mt-2">Through the Years</span>
                        </h2>
                    </motion.div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20"></div>

                        <div className="space-y-12">
                            {timeline.map((item, index) => (
                                <motion.div
                                    key={item.year}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                >
                                    <div className="w-1/2"></div>
                                    <div className="relative flex items-center justify-center w-16 h-16">
                                        <div className="absolute w-4 h-4 bg-primary rounded-full animate-ping"></div>
                                        <div className="relative w-12 h-12 bg-base-100 rounded-full flex items-center justify-center shadow-xl border-4 border-primary">
                                            <span className="text-primary font-bold">{item.year.toString().slice(-2)}</span>
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <div className="card bg-base-100 shadow-xl max-w-md">
                                            <div className="card-body">
                                                <span className="text-primary font-bold text-xl">{item.year}</span>
                                                <h3 className="text-xl font-bold">{item.title}</h3>
                                                <p className="text-base-content/70">{item.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-base-200/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            Meet the Team
                            <span className="text-primary block mt-2">Behind ZapShift</span>
                        </h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                            Passionate innovators dedicated to transforming your shipping experience
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {teamMembers.map((member) => (
                            <motion.div
                                key={member.id}
                                variants={fadeIn}
                                className="card bg-base-100 shadow-xl"
                            >
                                <figure className="px-4 pt-4">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="rounded-xl w-full h-48 object-cover"
                                    />
                                </figure>
                                <div className="card-body text-center">
                                    <h3 className="text-xl font-bold">{member.name}</h3>
                                    <p className="text-primary font-semibold">{member.role}</p>
                                    <p className="text-sm text-base-content/70 mt-2">{member.bio}</p>

                                    <div className="flex justify-center gap-2 mt-4">
                                        <a href={member.social.linkedin} className="btn btn-circle btn-xs btn-outline">
                                            <FaLinkedin />
                                        </a>
                                        <a href={member.social.twitter} className="btn btn-circle btn-xs btn-outline">
                                            <FaTwitter />
                                        </a>
                                        <a href={member.social.email} className="btn btn-circle btn-xs btn-outline">
                                            <FaEnvelope />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            What Our Clients Say
                            <span className="text-primary block mt-2">About Us</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((item) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: item * 0.1 }}
                                className="card bg-base-100 shadow-xl"
                            >
                                <div className="card-body">
                                    <FaQuoteRight className="text-3xl text-primary/30 mb-4" />
                                    <p className="text-base-content/80 mb-6">
                                        "ZapShift transformed our delivery process. We've seen a 40%
                                        increase in customer satisfaction since switching to them."
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <div className="avatar placeholder">
                                            <div className="bg-primary text-primary-content rounded-full w-12">
                                                <span>JD</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold">John Doe</h4>
                                            <p className="text-sm text-base-content/70">CEO, Company {item}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-primary-content mb-6">
                            Ready to Transform Your Shipping?
                        </h2>
                        <p className="text-xl text-primary-content/90 mb-10">
                            Join thousands of businesses that trust ZapShift for their logistics needs.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn btn-lg bg-base-100 text-primary hover:bg-base-200 gap-2">
                                Get Started Now
                                <FaArrowRight />
                            </button>
                            <button className="btn btn-lg btn-outline text-primary-content border-primary-content hover:bg-primary-content/20">
                                Contact Sales
                            </button>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-primary-content/80">
                            <span className="flex items-center gap-2">
                                <FaCheckCircle /> No credit card required
                            </span>
                            <span className="flex items-center gap-2">
                                <FaCheckCircle /> 14-day free trial
                            </span>
                            <span className="flex items-center gap-2">
                                <FaCheckCircle /> 24/7 support
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info */}
            <section className="py-12 bg-base-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <FaMapMarkerAlt />
                            </div>
                            <div>
                                <h4 className="font-semibold">Visit Us</h4>
                                <p className="text-sm text-base-content/70">123 Innovation Drive, CA</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <FaPhone />
                            </div>
                            <div>
                                <h4 className="font-semibold">Call Us</h4>
                                <p className="text-sm text-base-content/70">+1 (800) 123-4567</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                <FaClock />
                            </div>
                            <div>
                                <h4 className="font-semibold">Working Hours</h4>
                                <p className="text-sm text-base-content/70">Mon-Fri: 9AM - 6PM EST</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;