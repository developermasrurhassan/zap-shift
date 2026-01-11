import React from 'react';
import locationMerchant from '../../../assets/location-merchant.png'
import { motion } from "motion/react";
const BeMerchant = () => {


    return (
        <div className=' pb-30 pt-30 max-w-7xl md:px-5  mx-auto '>
            <div data-aos="fade-up" className=" bg-no-repeat  bg-secondary md:px-10 rounded-4xl py-20 bg-[url('/src/assets/be-a-merchant-bg.png')]">
                <div className="hero-content gap-20 flex-col lg:flex-row-reverse">
                    <div className=''>
                        <img
                            src={locationMerchant}
                            className=""
                        />
                    </div>
                    <div className='lg:w-8/12  space-y-4'>
                        <h1 className="text-3xl lg:text-5xl text-white font-bold">Merchant and Customer Satisfaction is Our First Priority</h1>
                        <p className="py-6 text-amber-50">
                            We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
                        </p>
                        <div className="flex gap-4">
                            <motion.button initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.4,
                                    scale: { visualDuration: 0.4, bounce: 0.5 },
                                }}
                                className="max-sm:btn md:btn-wide border bg-primary hover:border hover:border-primary hover:bg-transparent hover:text-primary text-black font-bold  md:text-xl py-3 rounded-full hover:transition ease-in-out duration-300 ">Become a Merchant</motion.button>
                            <motion.button initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.4,
                                    scale: { visualDuration: 0.4, bounce: 0.5 },
                                }} className="max-sm:btn md:btn-block border bg-primary hover:border hover:border-primary hover:bg-transparent hover:text-primary text-black font-bold  md:text-xl py-3 rounded-full hover:transition ease-in-out duration-300 ">Earn with ZapShift Courier</motion.button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeMerchant;