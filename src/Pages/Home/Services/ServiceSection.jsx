import React, { useState } from 'react';
import {
    FaShippingFast,
    FaTruck,
    FaWarehouse,
    FaMoneyBillWave,
    FaBuilding,
    FaExchangeAlt,
    FaCheckCircle,
    FaClock,
    FaMapMarkedAlt,
    FaShieldAlt,
    FaUsers,
    FaUndo
} from 'react-icons/fa';

const ServiceSection = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    const services = [
        {
            title: "Express & Standard Delivery",
            description: "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery is available in Dhaka within 4–6 hours from pick-up to drop-off.",
            icon: <FaShippingFast />,
            hoverIcon: <FaClock />,
            features: ["24-72 Hours", "4-6 Hours Express", "Multiple Cities"],
            color: "from-blue-500 to-cyan-400"
        },
        {
            title: "Nationwide Delivery",
            description: "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
            icon: <FaTruck />,
            hoverIcon: <FaMapMarkedAlt />,
            features: ["All Districts", "48-72 Hours", "Home Delivery"],
            color: "from-green-500 to-emerald-400"
        },
        {
            title: "Fulfillment Solution",
            description: "We also offer customized service with inventory management support, online order processing, packaging, and after-sales support.",
            icon: <FaWarehouse />,
            hoverIcon: <FaUsers />,
            features: ["Inventory Management", "Packaging", "After-sales Support"],
            color: "from-purple-500 to-pink-400"
        },
        {
            title: "Cash on Home Delivery",
            description: "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
            icon: <FaMoneyBillWave />,
            hoverIcon: <FaShieldAlt />,
            features: ["100% COD", "Nationwide", "Guaranteed Safety"],
            color: "from-amber-500 to-orange-400"
        },
        {
            title: "Corporate Service / Contract Logistics",
            description: "Customized corporate services, which include warehouse and inventory management support.",
            icon: <FaBuilding />,
            hoverIcon: <FaCheckCircle />,
            features: ["Custom Solutions", "Warehouse Management", "Corporate Support"],
            color: "from-red-500 to-rose-400"
        },
        {
            title: "Parcel Return",
            description: "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
            icon: <FaExchangeAlt />,
            hoverIcon: <FaUndo />,
            features: ["Reverse Logistics", "Easy Returns", "Exchange Support"],
            color: "from-indigo-500 to-violet-400"
        }
    ];

    return (
        <section className="py-20 px-4 md:px-8 bg-linear-to-b from-base-100 to-base-200">
            <div className="max-w-7xl mx-auto">
                {/* Animated Heading */}
                <div className="text-center mb-16">
                    <div className="inline-block relative mb-4">
                        <span className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                            Our Services
                        </span>
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-linear-to-r from-primary to-secondary rounded-full animate-pulse"></div>
                    </div>

                    <p className="text-xl text-base-content/80 max-w-3xl mx-auto mt-6 leading-relaxed">
                        Enjoy fast, reliable parcel delivery with <span className="font-semibold text-primary">real-time tracking</span> and zero hassle.
                        From personal packages to business shipments—we deliver <span className="font-semibold text-secondary">on time, every time</span>.
                    </p>

                    {/* Stats Bar */}
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                        <div className="text-center p-4 bg-base-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                            <div className="text-3xl font-bold text-primary">99%</div>
                            <div className="text-sm opacity-75">On-time Delivery</div>
                        </div>
                        <div className="text-center p-4 bg-base-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                            <div className="text-3xl font-bold text-primary">64</div>
                            <div className="text-sm opacity-75">Districts Covered</div>
                        </div>
                        <div className="text-center p-4 bg-base-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                            <div className="text-3xl font-bold text-primary">24/7</div>
                            <div className="text-sm opacity-75">Support</div>
                        </div>
                        <div className="text-center p-4 bg-base-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                            <div className="text-3xl font-bold text-primary">4-6h</div>
                            <div className="text-sm opacity-75">Express Delivery</div>
                        </div>
                    </div>
                </div>

                {/* Services Grid with Enhanced Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="relative group"
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {/* Animated Background */}
                            <div className={`absolute inset-0 bg-linear-to-br ${service.color} opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-all duration-500 transform group-hover:scale-110`}></div>

                            {/* Main Card */}
                            <div className={`
                relative card bg-base-100 shadow-2xl border-2 border-base-300 
                transition-all duration-500 transform
                ${hoveredCard === index
                                    ? 'scale-105 -translate-y-2 shadow-2xl border-primary/20'
                                    : 'scale-100'
                                }
                h-full overflow-hidden
              `}>
                                {/* linear Border Top */}
                                <div className={`h-1 w-full bg-linear-to-r ${service.color} transition-all duration-500 ${hoveredCard === index ? 'h-2' : ''}`}></div>

                                <div className="card-body items-center text-center p-8">
                                    {/* Icon with Animation */}
                                    <div className="relative mb-6">
                                        <div className={`
                      text-6xl transition-all duration-500 transform
                      ${hoveredCard === index
                                                ? `scale-125 text-transparent bg-clip-text bg-linear-to-br ${service.color} rotate-12`
                                                : 'text-primary scale-100'
                                            }
                    `}>
                                            {hoveredCard === index ? service.hoverIcon : service.icon}
                                        </div>

                                        {/* Floating Badge */}
                                        <div className={`
                      absolute -top-2 -right-2 w-8 h-8 rounded-full 
                      bg-linear-to-br ${service.color} 
                      flex items-center justify-center text-white text-sm
                      transition-all duration-500 transform
                      ${hoveredCard === index ? 'scale-125 rotate-12' : 'scale-100'}
                    `}>
                                            <FaCheckCircle />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className={`
                    card-title text-2xl font-bold mb-4 transition-all duration-500
                    ${hoveredCard === index
                                            ? `text-transparent bg-clip-text bg-linear-to-r ${service.color}`
                                            : 'text-base-content'
                                        }
                  `}>
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className={`
                    text-base-content/80 mb-6 transition-all duration-500
                    ${hoveredCard === index ? 'text-base-content' : ''}
                  `}>
                                        {service.description}
                                    </p>

                                    {/* Features List */}
                                    <div className="w-full mt-auto">
                                        <div className="divider mb-4">Features</div>
                                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                                            {service.features.map((feature, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`
                            badge badge-outline transition-all duration-300
                            ${hoveredCard === index
                                                            ? `badge-primary scale-105`
                                                            : ''
                                                        }
                          `}
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Animated CTA Button */}
                                        <button className={`
                      btn w-full mt-4 transition-all duration-500 transform
                      ${hoveredCard === index
                                                ? `bg-linear-to-r ${service.color} text-white border-0 shadow-lg scale-105`
                                                : 'btn-outline btn-primary'
                                            }
                      hover:scale-105
                    `}>
                                            Learn More
                                            <span className={`
                        ml-2 transition-all duration-500 transform
                        ${hoveredCard === index ? 'translate-x-2' : ''}
                      `}>
                                                →
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Glow Effect */}
                            <div className={`
                absolute inset-0 rounded-3xl 
                bg-linear-to-br ${service.color} 
                opacity-0 group-hover:opacity-20
                transition-all duration-700
                -z-10
              `}></div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-20 text-center">
                    <div className="bg-linear-to-r from-primary/10 to-secondary/10 rounded-3xl p-10 max-w-4xl mx-auto">
                        <h3 className="text-3xl font-bold mb-4">
                            Ready to Ship with Confidence?
                        </h3>
                        <p className="text-lg mb-8 opacity-80">
                            Join thousands of satisfied customers who trust us with their deliveries
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn btn-primary text-black hover:text-white btn-lg px-8 shadow-lg hover:border-primary transform hover:-translate-y-1 transition-all">
                                Get Started Now
                            </button>
                            <button className="btn btn-outline btn-lg px-8 border-2 hover:bg-base-100 hover:border-primary">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceSection;