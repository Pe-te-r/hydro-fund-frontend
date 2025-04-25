import copy from 'clipboard-copy';
import { FiDollarSign, FiUsers, FiPieChart, FiTrendingUp, FiClock, FiAward, FiCopy } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useGetDashboardByIdQuery } from '../../slice/dashboard';

export default function AccountDashboard() {
    const { user } = useAuth();
    const { data: dashboardData, isLoading, isError } = useGetDashboardByIdQuery(user?.id || '',{refetchOnFocus:true,refetchOnReconnect:true,refetchOnMountOrArgChange:true});
    const [copied, setCopied] = useState(false);

    const formatVipTier = (tier: string) => {
        return tier === 'standard' ? 'Standard' :
            tier === 'premium' ? 'Premium' :
                tier === 'vip' ? 'VIP' :
                    tier.charAt(0).toUpperCase() + tier.slice(1);
    };

    const calculateAccountAge = (createdAt: string) => {
        const createdDate = new Date(createdAt);
        const now = new Date();
        const diffInMonths = (now.getFullYear() - createdDate.getFullYear()) * 12 +
            (now.getMonth() - createdDate.getMonth());

        if (diffInMonths < 1) return 'Less than a month';
        if (diffInMonths === 1) return '1 month';
        return `${diffInMonths} months`;
    };
    const [referralLink, setShareUrl] = useState('');
    console.log(referralLink)

    useEffect(() => {
        if (dashboardData?.ownReferral?.referralCode) {
            const baseUrl = window.location.origin;
            const refCode = dashboardData.ownReferral.referralCode;
            setShareUrl(`${baseUrl}/join?ref=${refCode}`);
        }
    }, [dashboardData?.ownReferral?.referralCode]);  // Only re-run when referralCode changes


    const copyReferralLink = () => {
        if (!referralLink) return;

        copy(referralLink)
            .then(() => {
                setCopied(true);
                toast.success('Copied!');
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((err:unknown) => {
                toast.error('Copy failed');
                console.error(err);
            });
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (isError) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-red-500 text-center p-4 rounded-lg bg-red-50 max-w-md">
                Error loading dashboard data. Please try again later.
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Dashboard Header */}
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">Account Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Welcome back <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">{dashboardData?.username}</span>! Here's your account summary
                    </p>
                   
                </div>

                {/* Stats Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Balance Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Account Balance</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    Ksh {parseFloat(dashboardData?.balance || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <FiDollarSign className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-600">
                            <FiTrendingUp className="mr-1" />
                            <span>Ready to invest</span>
                        </div>
                    </div>

                    {/* Total Invested Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Invested</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    Ksh {parseFloat(dashboardData?.totalInvested || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <FiPieChart className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            <span>Potential earnings: Ksh {(parseFloat(dashboardData?.totalInvested || '0') * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Referral Earnings Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Referral Earnings</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    Ksh {(dashboardData?.referralAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <FiUsers className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            <span>{dashboardData?.referralNo || 0} successful referrals</span>
                        </div>
                    </div>

                    {/* Total Withdrawn Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Withdrawn</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    Ksh {(dashboardData?.totalWithdrawn || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                                <FiDollarSign className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                            <span>Account status: <span className="capitalize">{dashboardData?.status}</span></span>
                        </div>
                    </div>

                    {/* VIP Status Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">VIP Status</p>
                                <p className="text-2xl font-bold text-gray-900">{formatVipTier(dashboardData?.vipTier || 'standard')}</p>
                            </div>
                            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                                <FiAward className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                            <FiClock className="mr-1" />
                            <span>Member for {calculateAccountAge(dashboardData?.createdAt || new Date().toISOString())}</span>
                        </div>
                    </div>
                </div>

                {/* Referral Section */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Your Referral Code</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-500 mb-1">Share your referral link and earn bonuses</p>
                                <div className="flex items-center bg-gray-100 rounded-lg p-2 overflow-x-auto">
                                    <code className="text-sm font-mono text-gray-800 truncate">
                                        {referralLink || "Generating link..."}
                                    </code>
                                </div>
                            </div>
                            <button
                                onClick={copyReferralLink}
                                disabled={!referralLink}
                                className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors cursor-pointer ${!referralLink
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                            >
                                <FiCopy className="mr-2" />
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Deposit Card */}
                    <Link to='/deposit' className="hover:shadow-lg transition-shadow">
                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 h-full cursor-pointer">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Make a Deposit</h3>
                            <p className="text-sm text-gray-500 mb-4">Add funds to your account to start investing</p>
                            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                                Deposit Funds
                            </button>
                        </div>
                    </Link>

                    {/* Invest Card */}
                    <Link to='/investments' className="hover:shadow-lg transition-shadow">
                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 h-full cursor-pointer">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Plans</h3>
                            <p className="text-sm text-gray-500 mb-4">Browse our available investment options</p>
                            <button className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer">
                                View Plans
                            </button>
                        </div>
                    </Link>

                    {/* Withdraw Card */}
                    <Link to='/withdraw' className="hover:shadow-lg transition-shadow">
                        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 h-full cursor-pointer">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Withdraw Funds</h3>
                            <p className="text-sm text-gray-500 mb-4">Request withdrawal of your earnings</p>
                            <button className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors cursor-pointer">
                                Withdraw Now
                            </button>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}