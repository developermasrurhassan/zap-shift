import React from 'react';
// Assuming you have these illustration images
import liveTracking from '../../../assets/live-tracking.png';
import safeDelivery from '../../../assets/safe-delivery.png';

const FeaturesSection = () => {
    const features = [
        {
            id: 1,
            title: "Live Parcel Tracking",
            description: "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
            image: liveTracking
        },
        {
            id: 2,
            title: "100% Safe Delivery",
            description: "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
            image: safeDelivery
        },
        {
            id: 3,
            title: "24/7 Call Center Support",
            description: "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
            image: safeDelivery
        }
    ];

    return (
        <section className="py-16 px-4 md:px-8 bg-base-100">
            <div className="max-w-7xl mx-auto">
                {/* Feature Cards */}
                <div className="space-y-8">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="group card bg-base-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden border border-base-300"
                        >
                            <div className="flex flex-col lg:flex-row">
                                {/* Image/Illustration Section (35%) */}
                                <div className="lg:w-2/7 p-8 flex items-center justify-center bg-amber-50">
                                    <div className="relative">
                                        <img
                                            src={feature.image}
                                            alt={feature.title}
                                            className="h-40 w-auto object-contain group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                </div>

                                {/* Vertical Divider - Hidden on mobile, visible on desktop */}
                                <div className="hidden lg:flex px-5 items-center justify-center z-10 ">
                                    <div className="h-40 w-0.5  bg-primary"></div>
                                </div>

                                {/* Text Section (65%) */}
                                <div className="lg:w-4/7 p-8">
                                    <div className="flex flex-col justify-center h-full">
                                        <h3 className="text-2xl md:text-3xl font-bold text-base-content mb-4 group-hover:text-primary transition-colors duration-300">
                                            {feature.title}
                                        </h3>
                                        <p className="text-base-content/80 text-lg leading-relaxed group-hover:text-base-content transition-colors duration-300">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;