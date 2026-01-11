import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaQuoteLeft, FaQuoteRight, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import reviewIllustration from '../../../assets/customer-top.png'

const ClientReviews = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const reviewsPerPage = 3;

    // 10 fake reviews with Bangladeshi context
    const reviews = [
        {
            id: 1,
            name: "Rajib Ahmed",
            role: "E-commerce Business Owner",
            company: "StyleMart Bangladesh",
            review: "Delivery Partner has transformed my online business! Their 24-hour delivery in Dhaka is a game-changer. Customer satisfaction increased by 40% after switching to their services.",
            rating: 5,
            location: "Dhaka"
        },
        {
            id: 2,
            name: "Fatima Akter",
            role: "Operations Manager",
            company: "Chaldal Groceries",
            review: "The real-time tracking feature is incredibly accurate. Our customers love being able to track their groceries from warehouse to doorstep. Excellent service!",
            rating: 5,
            location: "Chittagong"
        },
        {
            id: 3,
            name: "Arif Hossain",
            role: "Logistics Coordinator",
            company: "Daraz Seller",
            review: "Cash on delivery service across all 64 districts has been a blessing. Secure, reliable, and their customer support is always available when we need them.",
            rating: 4,
            location: "Sylhet"
        },
        {
            id: 4,
            name: "Nusrat Jahan",
            role: "Shopify Store Owner",
            company: "NusCrafts",
            review: "As a small business owner, their fulfillment solution has saved me hours of work daily. Packaging, inventory management, and delivery - all handled perfectly!",
            rating: 5,
            location: "Khulna"
        },
        {
            id: 5,
            name: "Karim Uddin",
            role: "CEO",
            company: "TechGadget BD",
            review: "Corporate service package is worth every penny. Their warehouse management and custom solutions have streamlined our entire supply chain operation.",
            rating: 5,
            location: "Rajshahi"
        },
        {
            id: 6,
            name: "Sadia Rahman",
            role: "Founder",
            company: "BdKnitwear",
            review: "Parcel return facility through reverse logistics has reduced our operational headaches significantly. Very professional team and reliable service.",
            rating: 4,
            location: "Dhaka"
        },
        {
            id: 7,
            name: "Imran Khan",
            role: "Supply Chain Director",
            company: "Foodpanda Bangladesh",
            review: "Nationwide delivery with such efficiency is remarkable. Consistent 48-72 hour delivery even to remote districts. Highly recommended!",
            rating: 5,
            location: "Chittagong"
        },
        {
            id: 8,
            name: "Luna Akter",
            role: "Operations Head",
            company: "Ajkerdeal Partner",
            review: "Express delivery in Dhaka within 4-6 hours has helped us meet urgent orders. Their team is responsive and professional at all times.",
            rating: 5,
            location: "Dhaka"
        },
        {
            id: 9,
            name: "Tarek Islam",
            role: "Business Development",
            company: "Evaly Merchant",
            review: "100% safe delivery guarantee gives us peace of mind. Not a single damaged parcel reported in the last 6 months. Excellent service!",
            rating: 4,
            location: "Sylhet"
        },
        {
            id: 10,
            name: "Jannatul Ferdous",
            role: "Owner",
            company: "Moonstar Electronics",
            review: "The 24/7 call center support is a lifesaver. Always available to resolve any delivery concerns. Makes doing business so much easier!",
            rating: 5,
            location: "Dhaka"
        }
    ];

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const currentReviews = reviews.slice(
        currentPage * reviewsPerPage,
        (currentPage + 1) * reviewsPerPage
    );

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const goToPage = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
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

    const paginationVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    return (
        <section className="py-20 px-4 md:px-8 ">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    {/* Small Image/Icon */}
                    <div className="relative inline-block mb-6">
                        <img src={reviewIllustration} alt="Review Illustration" />
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary mb-4">
                        What our customers are saying
                    </h2>

                    {/* Subtitle */}
                    <p className=" text-lg md:text-xl text-base-content/80 max-w-3xl mx-auto leading-relaxed">
                        Experience seamless delivery with thousands of satisfied customers across Bangladesh.
                        Join businesses that trust us for reliable, fast, and secure parcel delivery solutions.
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-8 mt-10">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <div className="text-3xl font-bold text-primary">4.9/5</div>
                            <div className="text-sm opacity-75">Average Rating</div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <div className="text-3xl font-bold text-primary">10K+</div>
                            <div className="text-sm opacity-75">Reviews</div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <div className="text-3xl font-bold text-primary">98%</div>
                            <div className="text-sm opacity-75">Would Recommend</div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Reviews Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                    >
                        {currentReviews.map((review) => (
                            <motion.div
                                key={review.id}
                                variants={itemVariants}
                                whileHover={{
                                    y: -10,
                                    transition: { duration: 0.3 }
                                }}
                                className="relative"
                            >
                                <div className="card bg-base-100 shadow-2xl hover:shadow-3xl transition-all duration-300 h-full">
                                    <div className="card-body p-8">
                                        {/* Big Quote Symbol */}
                                        <div className="absolute top-4 left-4">
                                            <FaQuoteLeft className="text-6xl text-primary/10" />
                                        </div>

                                        {/* Rating Stars */}
                                        <div className="flex gap-1 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={`text-xl ${i < review.rating ? 'text-amber-400' : 'text-base-300'}`}
                                                />
                                            ))}
                                        </div>

                                        {/* Review Text */}
                                        <p className="text-lg italic text-base-content/90 mb-8 leading-relaxed relative z-10">
                                            "{review.review}"
                                        </p>

                                        {/* Closing Quote Symbol */}
                                        <div className="absolute bottom-16 right-4">
                                            <FaQuoteRight className="text-4xl text-primary/10" />
                                        </div>

                                        {/* Dashed Divider */}
                                        <div className="relative my-6">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-dashed border-base-300"></div>
                                            </div>
                                        </div>

                                        {/* Reviewer Info */}
                                        <div className="flex items-center gap-4">
                                            <div className="avatar placeholder">

                                            </div>
                                            <div>
                                                <h4 className="font-bold text-base-content">{review.name}</h4>
                                                <p className="text-sm text-base-content/70">{review.role}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-primary font-medium">{review.company}</span>
                                                    <span className="text-xs opacity-60">•</span>
                                                    <span className="text-xs opacity-60">{review.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* linear Border Bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-secondary to-primary opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-b-2xl"></div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                <motion.div
                    variants={paginationVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center gap-6"
                >
                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={prevPage}
                            className="btn btn-circle btn-primary btn-sm shadow-lg hover:shadow-xl"
                            aria-label="Previous page"
                        >
                            <FaChevronLeft className='text-black' />
                        </button>

                        {/* Page Dots */}
                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToPage(index)}
                                    className={`
                    w-3 h-3 rounded-full transition-all duration-300
                    ${currentPage === index
                                            ? 'bg-linear-to-r from-primary to-secondary w-8'
                                            : 'bg-base-300 hover:bg-primary/50'
                                        }
                  `}
                                    aria-label={`Go to page ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextPage}
                            className="btn btn-circle btn-primary btn-sm shadow-lg hover:shadow-xl"
                            aria-label="Next page"
                        >
                            <FaChevronRight className="text-black" />
                        </button>
                    </div>

                    {/* Page Info */}
                    <div className="text-sm text-base-content/70">
                        Showing {currentPage * reviewsPerPage + 1} - {Math.min((currentPage + 1) * reviewsPerPage, reviews.length)} of {reviews.length} reviews
                    </div>
                </motion.div>

                {/* Trust Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-4 bg-base-100 rounded-full px-8 py-4 shadow-lg">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="text-amber-400" />
                            ))}
                        </div>
                        <span className="font-bold text-lg">Trusted by 1000+ Businesses Across Bangladesh</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ClientReviews;