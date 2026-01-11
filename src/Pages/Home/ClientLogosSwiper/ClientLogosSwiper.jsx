import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import amazon from '../../../assets/brands/amazon.png'
import casio from '../../../assets/brands/casio.png'
import randstad from '../../../assets/brands/randstad.png'
import moonstar from '../../../assets/brands/moonstar.png'
import star from '../../../assets/brands/star.png'
import star_people from '../../../assets/brands/start_people.png'
import amazon2 from '../../../assets/brands/amazon_vector.png'

const ClientLogosSwiper = () => {
    const logos = [
        { id: 1, name: "amazon", image: amazon },
        { id: 2, name: "casio", image: casio },
        { id: 3, name: "randstad", image: randstad },
        { id: 4, name: "moonstar", image: moonstar },
        { id: 5, name: "star", image: star },
        { id: 6, name: "star_people", image: star_people },
        { id: 7, name: "amazon2", image: amazon2 },
    ];

    return (
        <section data-aos="fade-down" className="py-16 px-4 md:px-8 bg-base-100">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                        We've helped thousands of sales teams
                    </h2>
                    <p className="text-lg  max-w-2xl mx-auto">
                        Trusted by industry leaders across Bangladesh
                    </p>
                </div>

                {/* Swiper Slider */}
                <Swiper
                    modules={[Autoplay, Navigation]}
                    spaceBetween={30}
                    slidesPerView={2}
                    breakpoints={{
                        640: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 5 },
                    }}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    navigation={true}
                    loop={true}
                    className="py-8"
                >
                    {logos.map((logo) => (
                        <SwiperSlide key={logo.id}>
                            <div className="group cursor-pointer">
                                <div className={`
                   rounded-2xl p-8
                   hover:shadow-2xl
                  border-2 border-base-300
                  hover:border-primary/50
                  transition-all duration-300
                  transform hover:-translate-y-2
                  h-40 flex flex-col items-center justify-center
                `}>
                                    <img
                                        src={logo.image}
                                        alt={logo.name}
                                        className="h-16 w-auto object-contain filter group-hover:brightness-110 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Stats */}
                <div className="mt-12 text-center">
                    <div className="inline-grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-primary">1K+</div>
                            <div className="text-sm opacity-75">Clients</div>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-primary">50K+</div>
                            <div className="text-sm opacity-75">Deliveries</div>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-primary">98%</div>
                            <div className="text-sm opacity-75">Satisfaction</div>
                        </div>
                        <div className="text-center p-4">
                            <div className="text-3xl font-bold text-primary">64</div>
                            <div className="text-sm opacity-75">Districts</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClientLogosSwiper;