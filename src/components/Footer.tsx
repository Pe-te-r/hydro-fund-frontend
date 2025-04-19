import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', url: '/' },
        { name: 'About Us', url: '/about' },
        { name: 'Invest', url: '/investments' },
        { name: 'Contact', url: '/contact' },
    ];

    const legalLinks = [
        { name: 'Privacy Policy', url: '/privacy' },
        { name: 'Terms of Service', url: '/terms' },
    ];

    const socialLinks = [
        { icon: <FiFacebook />, url: 'https://facebook.com/hydrofund' },
        { icon: <FiTwitter />, url: 'https://twitter.com/hydrofund' },
        { icon: <FiInstagram />, url: 'https://instagram.com/hydrofund' },
        { icon: <FiLinkedin />, url: 'https://linkedin.com/company/hydrofund' },
        { icon: <FiYoutube />, url: 'https://youtube.com/hydrofund' },
    ];

    return (
        <footer className="bg-gradient-to-r from-blue-900 to-blue-700 text-white pt-12 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Logo and Description */}
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold mb-4">HydroFund</h2>
                        <p className="text-blue-100 mb-4">
                            Empowering sustainable hydropower projects through community investment and innovation.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <Link
                                    key={index}
                                    to={social.url}
                                    // target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-blue-300 transition-colors duration-300 text-xl"
                                >
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.url}
                                        className="text-blue-100 hover:text-white transition-colors duration-300"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {legalLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        to={link.url}
                                        className="text-blue-100 hover:text-white transition-colors duration-300"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <FiMail className="mt-1 mr-3" />
                                <span>contact@hydrofund.org</span>
                            </li>
                            <li className="flex items-start">
                                <FiPhone className="mt-1 mr-3" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-start">
                                <FiMapPin className="mt-1 mr-3" />
                                <span>123 Energy Street, Hydroville, HV 12345</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-blue-600 my-6"></div>

                {/* Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-blue-200 text-sm">
                        &copy; {currentYear} HydroFund. All rights reserved.
                    </p>
                    <p className="text-blue-200 text-sm mt-2 md:mt-0">
                        Committed to sustainable energy solutions.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;