import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaChevronDown, FaQuestionCircle, FaShippingFast, FaClock, FaShieldAlt, FaHeadset, FaLongArrowAltRight } from 'react-icons/fa';
import { Link } from 'react-router';
import { FaArrowUp } from 'react-icons/fa6';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            id: 1,
            question: "How does live parcel tracking work?",
            answer: "Our live parcel tracking uses GPS technology to provide real-time updates on your shipment's location. You'll receive notifications at every stage: pick-up, transit, out for delivery, and delivery completion. Track through our website, mobile app, or SMS updates.",
            icon: <FaShippingFast />
        },
        {
            id: 2,
            question: "What are your delivery timeframes across Bangladesh?",
            answer: "In Dhaka: 4-6 hours (Express) & 24 hours (Standard). Major cities (Chittagong, Sylhet, Khulna, Rajshahi): 24-72 hours. Nationwide delivery to all 64 districts: 48-72 hours with home delivery service.",
            icon: <FaClock />
        },
        {
            id: 3,
            question: "Is Cash on Delivery available nationwide?",
            answer: "Yes! We offer 100% Cash on Delivery service across all 64 districts of Bangladesh. Your cash is collected securely and transferred to you through our guaranteed safe payment system with complete transparency.",
            icon: <FaShieldAlt />
        },
        {
            id: 4,
            question: "What happens if my parcel is damaged or lost?",
            answer: "We offer 100% compensation for damaged or lost parcels. Our insured delivery service ensures your goods are protected. Simply contact our 24/7 support team within 24 hours of delivery for immediate assistance and claim processing.",
            icon: <FaHeadset />
        },
        {
            id: 5,
            question: "Do you offer corporate/business solutions?",
            answer: "Yes! We provide customized corporate packages including: Warehouse management, Inventory support, Bulk rate discounts, Dedicated account managers, Custom reporting, and API integration for seamless e-commerce operations.",
            icon: <FaQuestionCircle />
        }
    ];

    const additionalFAQs = [
        {
            id: 6,
            question: "Can I schedule a delivery for a specific time?",
            answer: "Yes, we offer scheduled delivery options. You can choose your preferred delivery time slot during booking. Additional charges may apply for specific time window deliveries.",
            category: "Delivery"
        },
        {
            id: 7,
            question: "What payment methods do you accept?",
            answer: "We accept Cash on Delivery, bKash, Nagad, Rocket, credit/debit cards, and bank transfers. Corporate clients can avail monthly billing options.",
            category: "Payment"
        },
        {
            id: 8,
            question: "How do I prepare my parcel for shipping?",
            answer: "Pack items securely in a box, seal properly, attach your shipping label clearly. For fragile items, use bubble wrap. We also offer professional packaging services at our hubs.",
            category: "Shipping"
        },
        {
            id: 9,
            question: "What items are prohibited for delivery?",
            answer: "We cannot deliver: Illegal items, hazardous materials, perishable goods without special arrangements, cash/currency, weapons, or restricted pharmaceuticals.",
            category: "Restrictions"
        },
        {
            id: 10,
            question: "How can I become a corporate partner?",
            answer: "Contact our business development team through the website form. We'll schedule a consultation, assess your needs, and create a customized logistics solution for your business.",
            category: "Business"
        },
        {
            id: 11,
            question: "Do you offer international shipping?",
            answer: "Currently we focus on nationwide delivery within Bangladesh. For international shipping, we partner with global carriers - contact our support for specific international shipping inquiries.",
            category: "International"
        },
        {
            id: 12,
            question: "Can I change delivery address after booking?",
            answer: "Yes, address changes are possible before the parcel is dispatched. Use our tracking portal or contact support. Additional charges may apply for significant address changes.",
            category: "Delivery"
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    const contentVariants = {
        collapsed: {
            height: 0,
            opacity: 0
        },
        expanded: {
            height: "auto",
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <section className="py-20 px-4 md:px-8 bg-linear-to-b from-base-200 to-base-100">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    {/* Icon */}
                    <div className="relative inline-block mb-6">
                        <div className="w-20 h-20 rounded-full bg-linear-to-r from-primary to-secondary flex items-center justify-center">
                            <FaQuestionCircle className="text-4xl text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                            <span className="text-sm font-bold">?</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary mb-4">
                        Frequently Asked Questions (FAQ)
                    </h2>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-base-content/80 max-w-3xl mx-auto leading-relaxed">
                        Find quick answers to common questions about our delivery services.
                        From tracking to payments, we've got you covered with transparent information.
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-6 mt-10">
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-primary">24/7</div>
                            <div className="text-sm opacity-75">Support Available</div>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-primary">5 min</div>
                            <div className="text-sm opacity-75">Avg. Response Time</div>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-primary">100%</div>
                            <div className="text-sm opacity-75">Answered Queries</div>
                        </div>
                    </div>
                </motion.div>

                {/* FAQ Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.01 }}
                            className="overflow-hidden"
                        >
                            <div
                                className={`
                  card cursor-pointer transition-all duration-300
                  ${openIndex === index
                                        ? 'bg-linear-to-r from-primary/10 to-secondary/10 border-primary/30'
                                        : 'bg-base-100 hover:bg-base-200'
                                    }
                  border-2 ${openIndex === index ? 'border-primary/30' : 'border-base-300'}
                  shadow-lg hover:shadow-xl
                `}
                                onClick={() => toggleFAQ(index)}
                            >
                                <div className="card-body p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${openIndex === index ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                                                {faq.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-base-content">
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: openIndex === index ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-primary"
                                        >
                                            <FaChevronDown />
                                        </motion.div>
                                    </div>

                                    {/* Animated Content */}
                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div
                                                variants={contentVariants}
                                                initial="collapsed"
                                                animate="expanded"
                                                exit="collapsed"
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-6 pl-16">
                                                    <div className="relative">
                                                        {/* Quote Style */}
                                                        <div className="absolute -left-4 top-0 text-4xl text-primary/20">
                                                            "
                                                        </div>
                                                        <p className="text-lg text-base-content/80 leading-relaxed">
                                                            {faq.answer}
                                                        </p>
                                                        <div className="flex gap-2 mt-4">
                                                            <span className="badge text-black badge-primary">Helpful</span>
                                                            <span className="badge badge-outline">Delivery</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Progress Bar Animation */}
                                <div className="relative h-1 bg-base-300">
                                    <motion.div
                                        className="absolute h-full bg-linear-to-r from-primary to-secondary"
                                        initial={{ width: "0%" }}
                                        animate={{ width: openIndex === index ? "100%" : "0%" }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* More FAQ Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12 flex  items-center justify-center"
                >
                    <Link className="font-bold  btn btn-outline border-primary btn-lg px-8 border-2 hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                        More FAQ

                    </Link>
                    <Link
                        to={'/faq'}
                        className='btn bg-black text-amber-50 border-2  hover:border-primary hover:bg-transparent hover:text-black transition-all duration-300 transform hover:-translate-y-1 rounded-full w-16 h-16 flex items-center justify-center'
                    >
                        <FaArrowUp className="group-hover:translate-x-1 transition-transform rotate-45" />
                    </Link>

                </motion.div>
                <p className="text-sm text-center text-base-content/60 mt-4">
                    Explore {additionalFAQs.length} more frequently asked questions
                </p>

                {/* Quick Help Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-16 bg-linear-to-r from-primary/5 to-secondary/5 rounded-3xl p-8"
                >
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-2">Still Need Help?</h3>
                        <p className="text-base-content/80">Our team is ready to assist you 24/7</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-base-100 rounded-2xl hover:shadow-xl transition-shadow">
                            <div className="text-3xl mb-3">📞</div>
                            <h4 className="font-bold mb-2">Call Support</h4>
                            <p className="text-sm opacity-75">16297 (24/7)</p>
                        </div>
                        <div className="text-center p-6 bg-base-100 rounded-2xl hover:shadow-xl transition-shadow">
                            <div className="text-3xl mb-3">💬</div>
                            <h4 className="font-bold mb-2">Live Chat</h4>
                            <p className="text-sm opacity-75">Instant Response</p>
                        </div>
                        <div className="text-center p-6 bg-base-100 rounded-2xl hover:shadow-xl transition-shadow">
                            <div className="text-3xl mb-3">✉️</div>
                            <h4 className="font-bold mb-2">Email Support</h4>
                            <p className="text-sm opacity-75">support@delivery.com</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;