import React from 'react';
import ZapShiftLogo from '../Logo/ZapShiftLogo';
import { Link } from 'react-router';
import { FaFacebookF, FaXTwitter, FaYoutube } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="footer footer-horizontal footer-center bg-neutral text-neutral-content p-10">
            <aside>
                <ZapShiftLogo />
                <p className="font-bold">
                    ACME Industries Ltd.
                    <br />
                    Providing reliable tech since 1992
                </p>
                <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
            </aside>
            <nav>
                <div className="grid grid-flow-col gap-4">
                    <Link>
                        <FaFacebookF className="w-7 h-7" />
                    </Link>
                    <Link>
                        <FaXTwitter className="w-7 h-7" />
                    </Link>
                    <Link>
                        <FaYoutube className="w-7 h-7" />
                    </Link>
                </div>
            </nav>
        </footer>
    );
};

export default Footer;