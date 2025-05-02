import { FiMail, FiMessageSquare, FiUsers, FiGlobe, FiPhone, FiMapPin, FiInfo, FiClock } from 'react-icons/fi';

export default function ContactPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact HydroFund Solutions</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Get in touch with our team for any inquiries or support
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <FiMessageSquare className="mr-2 text-blue-600" />
                            Contact Channels
                        </h2>

                        <div className="space-y-6">
                            {/* Email */}
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <FiMail className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Email Us</h3>
                                    <p className="text-gray-600 mb-2">Send us an email for general inquiries</p>
                                    <a
                                        href="mailto:hydrofundsolutions@gmail.com"
                                        className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        hydrofundsolutions@gmail.com
                                    </a>
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="flex items-start">
                                <div className="bg-green-100 p-3 rounded-full mr-4">
                                    <FiPhone className="text-green-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">WhatsApp Chat</h3>
                                    <p className="text-gray-600 mb-2">Message us directly on WhatsApp</p>
                                    <a
                                        href="https://wa.me/message/ICQPLKGQUJAGM1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                    >
                                        Open WhatsApp
                                    </a>
                                </div>
                            </div>

                            {/* Telegram Community */}
                            <div className="flex items-start">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <FiUsers className="text-blue-500 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Telegram Community</h3>
                                    <p className="text-gray-600 mb-2">Join our investor community on Telegram</p>
                                    <a
                                        href="https://t.me/+wf2hWsIEhm4yNzg0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                    >
                                        Join Telegram Group
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <FiInfo className="mr-2 text-blue-600" />
                            More Information
                        </h2>

                        <div className="space-y-6">
                            {/* Operating Hours */}
                            <div className="flex items-start">
                                <div className="bg-purple-100 p-3 rounded-full mr-4">
                                    <FiClock className="text-purple-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Operating Hours</h3>
                                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM EAT</p>
                                    <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM EAT</p>
                                    <p className="text-gray-600">Sunday: Closed</p>
                                </div>
                            </div>

                            {/* Response Time */}
                            <div className="flex items-start">
                                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                                    <FiMessageSquare className="text-yellow-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Response Time</h3>
                                    <p className="text-gray-600">Email: Within 24 hours</p>
                                    <p className="text-gray-600">WhatsApp: Typically within 2 hours during business hours</p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-start">
                                <div className="bg-red-100 p-3 rounded-full mr-4">
                                    <FiMapPin className="text-red-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Our Location</h3>
                                    <p className="text-gray-600">Nairobi, Kenya</p>
                                    <p className="text-gray-600">Virtual Office - All communications are digital</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-12 bg-white rounded-xl shadow-md overflow-hidden p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <FiGlobe className="mr-2 text-blue-600" />
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="font-medium text-gray-900">How do I start investing?</h3>
                            <p className="text-gray-600 mt-1">
                                You can begin by exploring our investment products and adding them to your cart.
                                For personalized assistance, message us on WhatsApp.
                            </p>
                        </div>

                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="font-medium text-gray-900">What payment methods do you accept?</h3>
                            <p className="text-gray-600 mt-1">
                                We accept M-Pesa, bank transfers, and other mobile money services.
                                Specific payment instructions are provided after checkout.
                            </p>
                        </div>

                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="font-medium text-gray-900">Is my investment secure?</h3>
                            <p className="text-gray-600 mt-1">
                                We implement strict security measures to protect your investments.
                                However, all investments carry some risk - please review each product's risk level.
                            </p>
                        </div>

                        <div className="pb-4">
                            <h3 className="font-medium text-gray-900">How do I track my investment?</h3>
                            <p className="text-gray-600 mt-1">
                                You'll receive regular updates via email and can message us on WhatsApp
                                anytime for your investment status.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}