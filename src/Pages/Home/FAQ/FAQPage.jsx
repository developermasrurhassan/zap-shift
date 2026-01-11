import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaChevronDown, FaSearch, FaFilter, FaHome } from 'react-icons/fa';
import { Link } from 'react-router';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const allFAQs = [
    // First 5 from homepage
    {
      id: 1,
      question: "How does live parcel tracking work?",
      answer: "Our live parcel tracking uses GPS technology to provide real-time updates on your shipment's location. You'll receive notifications at every stage: pick-up, transit, out for delivery, and delivery completion.",
      category: "Tracking"
    },
    {
      id: 2,
      question: "What are your delivery timeframes across Bangladesh?",
      answer: "In Dhaka: 4-6 hours (Express) & 24 hours (Standard). Major cities: 24-72 hours. Nationwide delivery to all 64 districts: 48-72 hours.",
      category: "Delivery"
    },
    {
      id: 3,
      question: "Is Cash on Delivery available nationwide?",
      answer: "Yes! We offer 100% Cash on Delivery service across all 64 districts of Bangladesh with guaranteed safe payment system.",
      category: "Payment"
    },
    {
      id: 4,
      question: "What happens if my parcel is damaged or lost?",
      answer: "We offer 100% compensation for damaged or lost parcels. Contact our 24/7 support within 24 hours for immediate assistance.",
      category: "Support"
    },
    {
      id: 5,
      question: "Do you offer corporate/business solutions?",
      answer: "Yes! We provide customized corporate packages including warehouse management, bulk discounts, and API integration.",
      category: "Business"
    },
    // Additional FAQs
    {
      id: 6,
      question: "Can I schedule a delivery for a specific time?",
      answer: "Yes, we offer scheduled delivery options. You can choose your preferred delivery time slot during booking.",
      category: "Delivery"
    },
    {
      id: 7,
      question: "What payment methods do you accept?",
      answer: "We accept Cash on Delivery, bKash, Nagad, Rocket, credit/debit cards, and bank transfers.",
      category: "Payment"
    },
    {
      id: 8,
      question: "How do I prepare my parcel for shipping?",
      answer: "Pack items securely in a box, seal properly, attach your shipping label clearly. We also offer professional packaging services.",
      category: "Shipping"
    },
    {
      id: 9,
      question: "What items are prohibited for delivery?",
      answer: "We cannot deliver: Illegal items, hazardous materials, perishable goods, cash/currency, weapons, or restricted pharmaceuticals.",
      category: "Restrictions"
    },
    {
      id: 10,
      question: "How can I become a corporate partner?",
      answer: "Contact our business development team through the website form for a customized logistics solution.",
      category: "Business"
    },
    {
      id: 11,
      question: "Do you offer international shipping?",
      answer: "Currently we focus on nationwide delivery. For international shipping, we partner with global carriers.",
      category: "International"
    },
    {
      id: 12,
      question: "Can I change delivery address after booking?",
      answer: "Yes, address changes are possible before the parcel is dispatched. Additional charges may apply.",
      category: "Delivery"
    },
    {
      id: 13,
      question: "What are your office hours?",
      answer: "Our hubs are open 8 AM - 10 PM daily. 24/7 online support and pick-up service available.",
      category: "Support"
    },
    {
      id: 14,
      question: "How do I track multiple parcels?",
      answer: "Use our bulk tracking feature on the website or app. You can track up to 50 parcels simultaneously.",
      category: "Tracking"
    },
    {
      id: 15,
      question: "Do you offer insurance for valuable items?",
      answer: "Yes, we offer optional insurance coverage for valuable items. Declare value during booking for coverage.",
      category: "Shipping"
    }
  ];

  const categories = ['All', 'Tracking', 'Delivery', 'Payment', 'Shipping', 'Support', 'Business', 'Restrictions'];

  const filteredFAQs = allFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
            <FaHome /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary mb-4">
            All FAQ
          </h1>
          <p className="text-lg text-base-content/80">
            Browse through all frequently asked questions about our delivery services
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Search questions..."
              className="input input-bordered w-full pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`btn btn-sm ${selectedCategory === category ? 'btn-primary text-black' : 'btn-outline'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden"
            >
              <div
                className={`card cursor-pointer transition-all duration-300 ${openIndex === index
                  ? 'bg-linear-to-r from-primary/10 to-secondary/10 border-primary/30'
                  : 'bg-base-100 hover:bg-base-200'
                  } border-2 ${openIndex === index ? 'border-primary/30' : 'border-base-300'}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="card-body p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="badge badge-primary text-black font-semibold">{faq.category}</div>
                      <h3 className="text-lg font-bold">{faq.question}</h3>
                    </div>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChevronDown />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pl-4 border-l-4 border-primary">
                          <p className="text-base-content/80">{faq.answer}</p>
                          <div className="flex gap-2 mt-3">
                            <button className="btn btn-xs">Helpful</button>
                            <button className="btn btn-xs btn-outline">Not Helpful</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 text-center">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Questions</div>
              <div className="stat-value text-primary">{allFAQs.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Categories</div>
              <div className="stat-value text-secondary">{categories.length - 1}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Answered</div>
              <div className="stat-value text-primary">100%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;