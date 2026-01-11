import React from 'react';
import Banner from '../Banner/Banner';
import ServiceSection from '../Services/ServiceSection';
import ClientLogosSwiper from '../ClientLogosSwiper/ClientLogosSwiper';
import FeaturesSection from '../FeaturesSection/FeaturesSection';
import BeMerchant from '../BeMerchant/BeMerchant';
import ClientReviews from '../ClientReviews/ClientReviews';
import FAQSection from '../FAQ/FAQSection';

const HomePage = () => {
    return (
        <div>
            <Banner></Banner>
            <ServiceSection></ServiceSection>
            <ClientLogosSwiper></ClientLogosSwiper>
            <FeaturesSection></FeaturesSection>
            <BeMerchant></BeMerchant>
            <ClientReviews></ClientReviews>
            <FAQSection></FAQSection>
        </div>
    );
};

export default HomePage;