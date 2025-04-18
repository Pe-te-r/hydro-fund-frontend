import { FiTarget, FiEye, FiShield, FiUsers, FiZap, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">About HydroFund Solutions</h1>
                    <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto">
                        Your trusted partner in sustainable financial empowerment
                    </p>
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <p className="text-lg text-gray-600 mb-8">
                        We are a fintech platform designed to revolutionize the way individuals and communities access funding and investment opportunities. At HydroFund, we believe in leveraging the power of technology to create transparent, inclusive, and impactful financial systems.
                    </p>
                    <p className="text-lg text-gray-600">
                        Founded with a vision to bridge the gap between financial needs and accessible support, HydroFund Solutions offers secure, user-friendly tools that allow members to save, invest, borrow, and grow—seamlessly.
                    </p>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Mission Card */}
                    <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-blue-500">
                        <div className="flex items-center mb-6">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                <FiTarget className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
                        </div>
                        <p className="text-gray-600">
                            To provide innovative financial solutions that empower individuals and transform communities through accessible, technology-driven platforms.
                        </p>
                    </div>

                    {/* Vision Card */}
                    <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-purple-500">
                        <div className="flex items-center mb-6">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                                <FiEye className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
                        </div>
                        <p className="text-gray-600">
                            To be the leading digital funding platform that promotes financial inclusion across Africa and beyond, creating opportunities for millions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Transparency */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                <FiShield className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Transparency</h3>
                        </div>
                        <p className="text-gray-600">
                            We maintain open communication and clear processes in all our operations, ensuring our members always know where they stand.
                        </p>
                    </div>

                    {/* Integrity */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                <FiHeart className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Integrity</h3>
                        </div>
                        <p className="text-gray-600">
                            We uphold the highest ethical standards, ensuring fairness and honesty in every interaction with our community.
                        </p>
                    </div>

                    {/* Innovation */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                                <FiZap className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Innovation</h3>
                        </div>
                        <p className="text-gray-600">
                            We continuously evolve our platform with cutting-edge technology to deliver exceptional financial solutions.
                        </p>
                    </div>

                    {/* Community Empowerment */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
                                <FiUsers className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Community Empowerment</h3>
                        </div>
                        <p className="text-gray-600">
                            We believe in lifting others as we climb, creating systems that enable collective growth and shared success.
                        </p>
                    </div>
                </div>
            </section>

            {/* Technology Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Technology</h2>
                    <div className="bg-white rounded-xl shadow-xl p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Built for Security & Efficiency</h3>
                                <p className="text-gray-600 mb-6">
                                    Our platform is engineered with cutting-edge security features and smart automation to ensure every transaction is safe and efficient. From automatic wallet deductions to instant payouts, we are committed to delivering a smooth and rewarding user experience.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        <span className="text-gray-600">Bank-grade encryption for all transactions</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        <span className="text-gray-600">Multi-factor authentication</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        <span className="text-gray-600">Real-time monitoring and fraud detection</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        <span className="text-gray-600">Seamless mobile experience</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-6 h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="inline-block p-6 bg-white rounded-lg shadow-md mb-4">
                                        <FiShield className="h-12 w-12 text-blue-600 mx-auto" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Secure by Design</h4>
                                    <p className="text-gray-600">
                                        Your financial security is our top priority
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Join the HydroFund Community</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Be part of a growing network that believes in impact-driven finance.
                    </p>
                    <Link to='/register'>
                    <button className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg shadow-lg transition-all transform hover:scale-105">
                        Get Started Today
                    </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}