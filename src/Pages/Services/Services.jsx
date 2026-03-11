// src/components/Services/Services.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaShippingFast,
    FaBoxOpen,
    FaWarehouse,
    FaTruck,
    FaGlobeAmericas,
    FaClock,
    FaShieldAlt,
    FaChartLine,
    FaHeadset,
    FaMobileAlt,
    FaSearch,
    FaCheckCircle,
    FaArrowRight,
    FaStar,
    FaRocket,
    FaMapMarkerAlt,
    FaCalendarCheck,
    FaBoxes,
    FaClipboardList,
    FaFileInvoiceDollar
} from 'react-icons/fa';

const Services = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedService, setSelectedService] = useState(null);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // Services data
    const services = [
        {
            id: 1,
            category: 'delivery',
            icon: <FaShippingFast className="w-8 h-8" />,
            title: 'Express Delivery',
            shortDesc: 'Same-day and next-day delivery for urgent shipments',
            fullDesc: 'Get your packages delivered faster than ever with our premium express delivery service. Perfect for time-sensitive documents, gifts, and urgent business shipments.',
            features: [
                'Same-day delivery in major cities',
                'Next-day delivery nationwide',
                'Real-time tracking updates',
                'SMS and email notifications',
                'Flexible pickup scheduling'
            ],
            price: 'Starting at $9.99',
            turnaround: '1-24 hours',
            color: 'primary'
        },
        {
            id: 2,
            category: 'warehouse',
            icon: <FaWarehouse className="w-8 h-8" />,
            title: 'Warehouse Storage',
            shortDesc: 'Secure, climate-controlled storage solutions',
            fullDesc: 'State-of-the-art warehouse facilities with 24/7 security and climate control. Perfect for businesses needing temporary or long-term storage solutions.',
            features: [
                'Climate-controlled units',
                '24/7 security monitoring',
                'Inventory management',
                'Flexible rental terms',
                'Loading dock access'
            ],
            price: 'Starting at $49.99/month',
            turnaround: 'Immediate access',
            color: 'secondary'
        },
        {
            id: 3,
            category: 'freight',
            icon: <FaTruck className="w-8 h-8" />,
            title: 'Freight Shipping',
            shortDesc: 'LTL and full truckload freight services',
            fullDesc: 'Comprehensive freight solutions for businesses of all sizes. We handle everything from pallet shipping to full truckloads with care and efficiency.',
            features: [
                'LTL and FTL options',
                'Freight consolidation',
                'Dock-to-dock delivery',
                'Freight insurance included',
                'Customs brokerage support'
            ],
            price: 'Custom quote',
            turnaround: '2-5 business days',
            color: 'accent'
        },
        {
            id: 4,
            category: 'international',
            icon: <FaGlobeAmericas className="w-8 h-8" />,
            title: 'International Shipping',
            shortDesc: 'Worldwide shipping with customs clearance',
            fullDesc: 'Expand your reach globally with our international shipping services. We handle all customs documentation and provide end-to-end tracking.',
            features: [
                'Door-to-door international delivery',
                'Customs clearance assistance',
                'International tracking',
                'Multi-language support',
                'Currency conversion options'
            ],
            price: 'Starting at $29.99',
            turnaround: '3-10 business days',
            color: 'primary'
        },
        {
            id: 5,
            category: 'ecommerce',
            icon: <FaBoxOpen className="w-8 h-8" />,
            title: 'E-commerce Fulfillment',
            shortDesc: 'End-to-end order fulfillment for online stores',
            fullDesc: 'Complete e-commerce fulfillment solution that handles inventory, packing, and shipping so you can focus on growing your business.',
            features: [
                'Inventory management',
                'Pick and pack services',
                'Branded packaging options',
                'Returns processing',
                'Multi-channel integration'
            ],
            price: 'Pay per order',
            turnaround: '24-hour processing',
            color: 'secondary'
        },
        {
            id: 6,
            category: 'specialized',
            icon: <FaShieldAlt className="w-8 h-8" />,
            title: 'Specialized Handling',
            shortDesc: 'Fragile, hazardous, and temperature-controlled shipping',
            fullDesc: 'Expert handling for items that need special care. From fragile artwork to temperature-sensitive pharmaceuticals, we ensure safe delivery.',
            features: [
                'Temperature-controlled vehicles',
                'Fragile item specialists',
                'Hazardous material certified',
                'White glove service',
                'Insurance options available'
            ],
            price: 'Custom quote',
            turnaround: 'Varies by service',
            color: 'accent'
        },
        {
            id: 7,
            category: 'logistics',
            icon: <FaChartLine className="w-8 h-8" />,
            title: 'Supply Chain Solutions',
            shortDesc: 'End-to-end logistics optimization',
            fullDesc: 'Comprehensive supply chain consulting and management services to optimize your logistics operations and reduce costs.',
            features: [
                'Logistics consulting',
                'Route optimization',
                'Cost reduction analysis',
                'Vendor management',
                'Performance reporting'
            ],
            price: 'Custom quote',
            turnaround: 'Ongoing support',
            color: 'primary'
        },
        {
            id: 8,
            category: 'returns',
            icon: <FaClipboardList className="w-8 h-8" />,
            title: 'Reverse Logistics',
            shortDesc: 'Efficient returns management',
            fullDesc: 'Streamlined returns processing that makes it easy for your customers to return items while you maintain control and visibility.',
            features: [
                'Automated returns portal',
                'Inspection and grading',
                'Refurbishment services',
                'Recycling options',
                'Real-time analytics'
            ],
            price: 'Starting at $5.99/return',
            turnaround: '2-3 days processing',
            color: 'secondary'
        }
    ];

    // Categories for filtering
    const categories = [
        { id: 'all', name: 'All Services', icon: <FaBoxes /> },
        { id: 'delivery', name: 'Delivery', icon: <FaShippingFast /> },
        { id: 'warehouse', name: 'Warehouse', icon: <FaWarehouse /> },
        { id: 'freight', name: 'Freight', icon: <FaTruck /> },
        { id: 'international', name: 'International', icon: <FaGlobeAmericas /> },
        { id: 'ecommerce', name: 'E-commerce', icon: <FaBoxOpen /> },
        { id: 'logistics', name: 'Logistics', icon: <FaChartLine /> }
    ];

    // Filter services based on active tab
    const filteredServices = activeTab === 'all'
        ? services
        : services.filter(service => service.category === activeTab);

    // Pricing plans data
    const pricingPlans = [
        {
            name: 'Starter',
            price: '$49',
            period: 'per month',
            description: 'Perfect for small businesses',
            features: [
                'Up to 100 shipments/month',
                'Basic tracking',
                'Email support',
                '48-hour delivery',
                'Warehouse storage: 10 sq ft'
            ],
            buttonText: 'Get Started',
            popular: false,
            color: 'primary'
        },
        {
            name: 'Professional',
            price: '$149',
            period: 'per month',
            description: 'Ideal for growing companies',
            features: [
                'Up to 500 shipments/month',
                'Real-time tracking',
                'Priority support 24/7',
                '24-hour delivery',
                'Warehouse storage: 50 sq ft',
                'API access',
                'Analytics dashboard'
            ],
            buttonText: 'Choose Plan',
            popular: true,
            color: 'secondary'
        },
        {
            name: 'Enterprise',
            price: '$499',
            period: 'per month',
            description: 'For large organizations',
            features: [
                'Unlimited shipments',
                'Advanced tracking',
                'Dedicated account manager',
                'Same-day delivery',
                'Warehouse storage: 200 sq ft',
                'Custom integration',
                'Advanced analytics',
                'SLA guarantee'
            ],
            buttonText: 'Contact Sales',
            popular: false,
            color: 'accent'
        }
    ];

    // FAQs data
    const faqs = [
        {
            question: 'How fast is your express delivery?',
            answer: 'Our express delivery service offers same-day delivery in major metropolitan areas and next-day delivery to most locations nationwide.'
        },
        {
            question: 'Do you offer international shipping?',
            answer: 'Yes, we ship to over 200 countries worldwide with full customs clearance assistance and tracking.'
        },
        {
            question: 'What areas do you cover?',
            answer: 'We currently serve all 50 states and have warehouse locations in 20 major cities across the country.'
        },
        {
            question: 'How do I track my shipment?',
            answer: 'You can track your shipment in real-time through our mobile app or website using your tracking number.'
        },
        {
            question: 'Do you offer bulk shipping discounts?',
            answer: 'Yes, we offer volume discounts for businesses shipping more than 100 packages per month. Contact our sales team for a custom quote.'
        },
        {
            question: 'What insurance options are available?',
            answer: 'We offer various insurance levels from basic coverage to full-value protection for high-value items.'
        }
    ];

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
                            Our Services
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Shipping Solutions
                            <span className="text-primary block mt-2">For Every Need</span>
                        </h1>
                        <p className="text-xl text-base-content/70 mb-10">
                            From urgent express deliveries to complex supply chain solutions,
                            we've got you covered with our comprehensive range of services.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                placeholder="Search for a service..."
                                className="input input-bordered w-full pl-12 pr-4 py-3 text-lg"
                            />
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="py-8 border-b border-base-300 sticky top-0 bg-base-100/80 backdrop-blur-sm z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveTab(category.id)}
                                className={`btn btn-sm gap-2 ${activeTab === category.id
                                        ? 'btn-primary'
                                        : 'btn-ghost'
                                    }`}
                            >
                                <span>{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredServices.map((service) => (
                            <motion.div
                                key={service.id}
                                variants={fadeInUp}
                                whileHover={{ y: -5 }}
                                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                                onClick={() => setSelectedService(service)}
                            >
                                <div className="card-body">
                                    <div className={`w-14 h-14 rounded-xl bg-${service.color}/10 text-${service.color} flex items-center justify-center mb-4`}>
                                        {service.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                    <p className="text-base-content/70 text-sm mb-4">{service.shortDesc}</p>

                                    <div className="flex items-center gap-2 text-sm mb-4">
                                        <FaClock className="text-primary" />
                                        <span>{service.turnaround}</span>
                                    </div>

                                    <div className="mt-auto">
                                        <span className="text-sm font-semibold text-primary">{service.price}</span>
                                    </div>

                                    <button className="btn btn-ghost btn-sm gap-2 mt-4 w-full">
                                        Learn More
                                        <FaArrowRight />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Service Detail Modal */}
            {selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-base-100 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-16 h-16 rounded-xl bg-${selectedService.color}/10 text-${selectedService.color} flex items-center justify-center`}>
                                    {selectedService.icon}
                                </div>
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="btn btn-circle btn-sm btn-ghost"
                                >
                                    ✕
                                </button>
                            </div>

                            <h2 className="text-3xl font-bold mb-2">{selectedService.title}</h2>
                            <p className="text-base-content/70 mb-6">{selectedService.fullDesc}</p>

                            <div className="flex gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <FaClock className="text-primary" />
                                    <span className="font-semibold">Turnaround:</span>
                                    <span>{selectedService.turnaround}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaFileInvoiceDollar className="text-primary" />
                                    <span className="font-semibold">Price:</span>
                                    <span>{selectedService.price}</span>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg mb-4">Features Included:</h3>
                            <ul className="space-y-3 mb-8">
                                {selectedService.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <FaCheckCircle className="text-primary mt-1 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex gap-4">
                                <button className="btn btn-primary flex-1">Get Started</button>
                                <button className="btn btn-outline flex-1">Contact Sales</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Why Choose Us Section */}
            <section className="py-20 bg-base-200/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            Why Choose
                            <span className="text-primary block mt-2">ZapShift Services</span>
                        </h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                            We combine technology with expertise to deliver the best shipping experience
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: <FaRocket />, title: 'Fast Delivery', desc: 'Lightning-fast shipping with real-time tracking' },
                            { icon: <FaShieldAlt />, title: 'Secure Handling', desc: 'Your items are safe with our insured shipping' },
                            { icon: <FaHeadset />, title: '24/7 Support', desc: 'Round-the-clock customer service' },
                            { icon: <FaMobileAlt />, title: 'Easy Tracking', desc: 'Track your shipments from any device' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card bg-base-100 shadow-xl"
                            >
                                <div className="card-body text-center">
                                    <div className="text-4xl text-primary mb-4">{item.icon}</div>
                                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                    <p className="text-base-content/70 text-sm">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            Simple, Transparent
                            <span className="text-primary block mt-2">Pricing Plans</span>
                        </h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                            Choose the perfect plan for your shipping needs
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`card bg-base-100 shadow-xl ${plan.popular ? 'ring-2 ring-secondary scale-105 md:scale-110' : ''
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-secondary text-secondary-content px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                                        Most Popular
                                    </div>
                                )}
                                <div className="card-body">
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-base-content/70">/{plan.period}</span>
                                    </div>
                                    <p className="text-base-content/70 text-sm mb-6">{plan.description}</p>

                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <FaCheckCircle className={`text-${plan.color} mt-1 flex-shrink-0`} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button className={`btn btn-${plan.color} ${plan.popular ? 'btn-secondary' : ''}`}>
                                        {plan.buttonText}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Areas */}
            <section className="py-20 bg-base-200/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-primary font-semibold text-lg mb-4 block">Coverage Map</span>
                            <h2 className="text-4xl font-bold mb-6">
                                We're Everywhere
                                <span className="text-primary block mt-2">You Need Us To Be</span>
                            </h2>
                            <p className="text-lg text-base-content/70 mb-6">
                                With warehouses in 20 major cities and delivery networks across the country,
                                we ensure your packages reach their destination quickly and safely.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary" />
                                    <span>New York</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary" />
                                    <span>Los Angeles</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary" />
                                    <span>Chicago</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary" />
                                    <span>Houston</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary" />
                                    <span>Miami</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary" />
                                    <span>Seattle</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary" />
                                    <span>Denver</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-primary" />
                                    <span>Atlanta</span>
                                </div>
                            </div>

                            <button className="btn btn-primary mt-8 gap-2">
                                View Full Coverage
                                <FaArrowRight />
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-base-100 p-8 rounded-2xl shadow-2xl"
                        >
                            <div className="grid grid-cols-2 gap-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                                        <div className="text-sm text-base-content/70">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4">
                            Frequently Asked
                            <span className="text-primary block mt-2">Questions</span>
                        </h2>
                        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                            Got questions? We've got answers
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card bg-base-100 shadow-xl"
                            >
                                <div className="card-body">
                                    <h3 className="font-bold text-lg mb-2 flex items-start gap-2">
                                        <FaStar className="text-primary text-sm mt-1" />
                                        {faq.question}
                                    </h3>
                                    <p className="text-base-content/70">{faq.answer}</p>
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
                            Ready to Start Shipping?
                        </h2>
                        <p className="text-xl text-primary-content/90 mb-10">
                            Join thousands of businesses that trust ZapShift for their logistics needs
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn btn-lg bg-base-100 text-primary hover:bg-base-200 gap-2">
                                Create Account
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
                                <FaCheckCircle /> Free trial available
                            </span>
                            <span className="flex items-center gap-2">
                                <FaCheckCircle /> Cancel anytime
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

// Stats data for the coverage section
const stats = [
    { value: '200+', label: 'Countries Served' },
    { value: '50K+', label: 'Daily Shipments' },
    { value: '99.9%', label: 'On-Time Delivery' },
    { value: '20', label: 'Warehouse Locations' }
];

export default Services;