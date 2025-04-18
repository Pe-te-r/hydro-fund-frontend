import { FiArrowRight, FiShield, FiPieChart, FiUsers, FiSmartphone, FiDollarSign, FiMail, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';


export default function HomePage() {
    const {user} = useAuth()
    return (
        <div className="bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-10 rounded-3xl"></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Welcome to <span className="text-blue-600">HydroFund Solutions</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
                        Empowering Dreams, One Drop at a Time
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {
                            !user&&
                        <Link to='/register'>
                            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all transform hover:scale-105">
                                Get Started
                            </button>                    
                        </Link>
                        }

                        <Link to='/about'>
                        <button className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 font-medium rounded-lg shadow-md border border-blue-200 transition-all">
                        Learn More</button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        At HydroFund Solutions, our mission is to democratize access to funding by removing traditional barriers and introducing a community-powered model that uplifts everyone involved. We envision a future where ideas aren't limited by lack of resources, but rather nurtured through collaboration, empowerment, and financial fluidity.
                    </p>
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <p className="text-blue-800 font-medium italic">
                            "Turning possibilities into progress through collaborative funding."
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose HydroFund Solutions?</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <FiPieChart className="text-blue-600 text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart, Transparent Funding</h3>
                            <p className="text-gray-600">
                                Multiple tiers of contribution plans with clearly defined returns. Full visibility into your growth and earnings.
                            </p>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <FiShield className="text-green-600 text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Transactions</h3>
                            <p className="text-gray-600">
                                Advanced encryption and multi-layered verification methods ensure every transaction is safe.
                            </p>
                        </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <FiSmartphone className="text-purple-600 text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">User-First Experience</h3>
                            <p className="text-gray-600">
                                Intuitive dashboard to track earnings, referrals, and monitor real-time statistics.
                            </p>
                        </div>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                                <FiUsers className="text-amber-600 text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Rewarding Referral Programs</h3>
                            <p className="text-gray-600">
                                Multi-level referral system that rewards users who invite others to the platform.
                            </p>
                        </div>
                    </div>

                    {/* Feature 5 */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                                <FiMessageSquare className="text-indigo-600 text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Community-Driven Support</h3>
                            <p className="text-gray-600">
                                Join our thriving network of like-minded users in our official community groups.
                            </p>
                        </div>
                    </div>

                    {/* Feature 6 */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                                <FiDollarSign className="text-teal-600 text-xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Withdrawals</h3>
                            <p className="text-gray-600">
                                No delays, no bottlenecks. Your earnings are yours to use when you want.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Financial Future?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of users who are already benefiting from our innovative platform.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {!user &&
                        <Link to='/register'>
                            <button className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg shadow-lg transition-all transform hover:scale-105">
                                Register Now
                            </button>
                        </Link>
                        }
                        <Link to='/contact'>
                        <button className="px-8 py-4 bg-transparent hover:bg-blue-700 text-white font-medium rounded-lg border border-white transition-all">
                            Contact Support
                        </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How HydroFund Works</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Step 1 */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-blue-600 font-bold text-xl">1</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Account</h3>
                        <p className="text-gray-600">Simple registration and instant activation</p>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex items-center justify-center">
                        <FiArrowRight className="text-gray-400 text-2xl" />
                    </div>

                    {/* Step 2 */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-blue-600 font-bold text-xl">2</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Plan</h3>
                        <p className="text-gray-600">Choose from flexible funding tiers</p>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex items-center justify-center">
                        <FiArrowRight className="text-gray-400 text-2xl" />
                    </div>

                    {/* Step 3 */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-blue-600 font-bold text-xl">3</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Fund & Grow</h3>
                        <p className="text-gray-600">Watch your investments grow daily</p>
                    </div>

                    {/* Arrow */}
                    <div className="hidden md:flex items-center justify-center">
                        <FiArrowRight className="text-gray-400 text-2xl" />
                    </div>

                    {/* Step 4 */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-blue-600 font-bold text-xl">4</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Withdraw Earnings</h3>
                        <p className="text-gray-600">Instant access to your funds</p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Have Questions?</h2>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <FiMail className="text-blue-600 mt-1 mr-3" />
                                            <div>
                                                <p className="font-medium text-gray-900">Email</p>
                                                <p className="text-gray-600">support@hydrofund.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <FiMessageSquare className="text-blue-600 mt-1 mr-3" />
                                            <div>
                                                <p className="font-medium text-gray-900">Telegram</p>
                                                <p className="text-gray-600">@HydroFundSupport</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Join Our Community</h3>
                                    <p className="text-gray-600 mb-4">
                                        Connect with other HydroFund users, get updates, and share experiences in our official community groups.
                                    </p>
                                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md">
                                        Join Telegram Group
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}