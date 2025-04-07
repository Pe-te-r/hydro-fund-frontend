import { FiActivity, FiDollarSign, FiUsers, FiPieChart, FiTrendingUp, FiClock, FiAward } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function AccountDashboard() {
    // Static data - replace with real data from your API
    const userStats = {
        balance: 1250.50,
        totalInvested: 5250.00,
        totalWithdrawn: 2500.00,
        referralEarnings: 350.00,
        activeInvestments: 3,
        referralCount: 7,
        accountAge: '3 months',
        vipLevel: 'Bronze'
    };

    const recentActivity = [
        { id: 1, type: 'Deposit', amount: 500.00, date: '2023-05-15', status: 'Completed' },
        { id: 2, type: 'Investment', amount: 1000.00, date: '2023-05-10', status: 'Active' },
        { id: 3, type: 'Withdrawal', amount: 250.00, date: '2023-05-05', status: 'Processing' },
        { id: 4, type: 'Referral Bonus', amount: 50.00, date: '2023-05-01', status: 'Completed' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Dashboard Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600">Welcome back! Here's what's happening with your account.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Balance Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Account Balance</p>
                                <p className="text-2xl font-bold text-gray-900">${userStats.balance.toFixed(2)}</p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <FiDollarSign className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-600">
                            <FiTrendingUp className="mr-1" />
                            <span>+2.5% this month</span>
                        </div>
                    </div>

                    {/* Total Invested Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Invested</p>
                                <p className="text-2xl font-bold text-gray-900">${userStats.totalInvested.toFixed(2)}</p>
                            </div>
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <FiPieChart className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            <span>{userStats.activeInvestments} active plans</span>
                        </div>
                    </div>

                    {/* Referral Earnings Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Referral Earnings</p>
                                <p className="text-2xl font-bold text-gray-900">${userStats.referralEarnings.toFixed(2)}</p>
                            </div>
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <FiUsers className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            <span>{userStats.referralCount} successful referrals</span>
                        </div>
                    </div>

                    {/* VIP Status Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">VIP Status</p>
                                <p className="text-2xl font-bold text-gray-900">{userStats.vipLevel}</p>
                            </div>
                            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                                <FiAward className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                            <FiClock className="mr-1" />
                            <span>Member for {userStats.accountAge}</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Section */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                            <FiActivity className="mr-2" /> Recent Activity
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{activity.type}</p>
                                        <p className="text-sm text-gray-500">{activity.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-medium ${activity.type === 'Deposit' || activity.type === 'Referral Bonus'
                                                ? 'text-green-600'
                                                : 'text-gray-900'
                                            }`}>
                                            {activity.type === 'Withdrawal' ? '-' : '+'}${activity.amount.toFixed(2)}
                                        </p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.status === 'Completed'
                                                ? 'bg-green-100 text-green-800'
                                                : activity.status === 'Processing'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {activity.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 text-center">
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            View all activity
                        </button>
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Deposit Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Make a Deposit</h3>
                        <p className="text-sm text-gray-500 mb-4">Add funds to your account to start investing</p>
                        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Deposit Funds
                        </button>
                    </div>

                    {/* Invest Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Plans</h3>
                        <p className="text-sm text-gray-500 mb-4">Browse our available investment options</p>
                        <Link to='/investments'>
                        <button className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                            View Plans
                        </button>
                        </Link>
                    </div>

                    {/* Referral Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Refer Friends</h3>
                        <p className="text-sm text-gray-500 mb-4">Earn bonuses by inviting friends</p>
                        <button className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                            Invite Friends
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}