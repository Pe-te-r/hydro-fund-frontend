import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaWallet, FaMoneyBillWave, FaChartLine, FaExchangeAlt, FaUsers, FaClock, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiActivity, FiDollarSign } from 'react-icons/fi';
import { MdEmail, MdPhone, MdSecurity, MdDateRange } from 'react-icons/md';
import { RiVipCrownFill } from 'react-icons/ri';
import { BiSolidUserDetail } from 'react-icons/bi';
import { useGetOneUserQuery } from '../../slice/admin/users';

const AdminUserData = () => {
    const { id } = useParams<{ id: string }>();
    const { data: userData, isLoading, isError, error } = useGetOneUserQuery(id || '',{refetchOnFocus:true,refetchOnReconnect:true,refetchOnMountOrArgChange:true});
    const user = userData?.data;

    // State for toggles
    const [showSecret, setShowSecret] = useState(false);
    const [investmentFilter, setInvestmentFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [withdrawalFilter, setWithdrawalFilter] = useState<'all' | 'pending' | 'completed'>('all');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500 text-center">
                    <h2 className="text-2xl font-bold">Error loading user data</h2>
                    <p>{(error as { data: { message: string }, status: number })?.data?.message || 'Unknown error occurred'}</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500 text-center">
                    <h2 className="text-2xl font-bold">User not found</h2>
                    <p>No user data available for ID: {id}</p>
                </div>
            </div>
        );
    }

    // Helper function to format currency
    const formatCurrency = (value: string | number) => {
        return parseFloat(value.toString()).toLocaleString('en-US', {
            style: 'currency',
            currency: 'Kes',
        });
    };

    // Calculate analytics
    const totalInvested = parseFloat(user?.investments?.totalInvested?.toString() || '0');
    const totalWithdrawn = parseFloat(user?.financial?.totalWithdrawnAmount?.toString() || '0');
    const netProfit = totalInvested - totalWithdrawn;

    // Filter investments based on selected filter
    const filteredInvestments = user.investments?.orders?.filter(order => {
        if (investmentFilter === 'all') return true;
        return order.status === investmentFilter;
    }) || [];

    // Filter withdrawals based on selected filter
    const filteredWithdrawals = user.financial?.withdrawals?.filter(withdrawal => {
        if (withdrawalFilter === 'all') return true;
        return withdrawal.status === withdrawalFilter;
    }) || [];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                    {/* Back Button */}
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="ml-1">Back</span>
                    </button>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-800">User Analytics Dashboard</h1>
                </div>

                {/* Status Badge */}
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${user?.userInfo?.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {user?.userInfo?.status.toUpperCase()}
                </span>
            </div>

            {/* User Profile Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center space-x-6">
                    <div className="bg-blue-100 p-4 rounded-full">
                        <FaUser className="text-blue-600 text-3xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{user?.userInfo?.username}</h2>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center text-gray-600">
                                <MdEmail className="mr-2" />
                                <span>{user.userInfo?.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <MdPhone className="mr-2" />
                                <span>{user.userInfo?.phone}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <RiVipCrownFill className="mr-2" />
                                <span className="capitalize">{user.userInfo?.vipTier}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <MdDateRange className="mr-2" />
                                <span>Joined: {new Date(user.userInfo?.createdAt).toLocaleString(undefined, {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Balance Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-gray-500 font-medium">Balance</h3>
                            <p className="text-2xl font-bold">{formatCurrency(user.userInfo?.balance || 0)}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FaWallet className="text-blue-600 text-xl" />
                        </div>
                    </div>
                </div>

                {/* Total Invested Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-gray-500 font-medium">Total Invested</h3>
                            <p className="text-2xl font-bold">{formatCurrency(totalInvested)}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <FiDollarSign className="text-green-600 text-xl" />
                        </div>
                    </div>
                </div>

                {/* Total Withdrawn Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-gray-500 font-medium">Total Withdrawn</h3>
                            <p className="text-2xl font-bold">{formatCurrency(totalWithdrawn)}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <FaMoneyBillWave className="text-purple-600 text-xl" />
                        </div>
                    </div>
                </div>

                {/* Net Profit Card */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-gray-500 font-medium">Net Profit</h3>
                            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {formatCurrency(netProfit)}
                            </p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <FaChartLine className="text-yellow-600 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Investments Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <FiActivity className="mr-2" /> Investments
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setInvestmentFilter('all')}
                                className={`px-3 py-1 rounded-full text-sm ${investmentFilter === 'all'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                All ({user.investments?.orders?.length || 0})
                            </button>
                            <button
                                onClick={() => setInvestmentFilter('active')}
                                className={`px-3 py-1 rounded-full text-sm ${investmentFilter === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                Active ({user.investments?.activeInvestments?.length || 0})
                            </button>
                            <button
                                onClick={() => setInvestmentFilter('completed')}
                                className={`px-3 py-1 rounded-full text-sm ${investmentFilter === 'completed'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                Completed ({user.investments?.completedInvestments?.length || 0})
                            </button>
                        </div>
                    </div>

                    {filteredInvestments.length > 0 ? (
                        <div className="space-y-4">
                            {filteredInvestments.map((order) => (
                                <div key={order.id} className="border-b pb-4 last:border-b-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium">Order #{order.id.slice(0, 8)}</h4>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleString(undefined, {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${order.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="bg-gray-50 p-2 rounded">
                                                    <p className="text-sm font-medium">{item.productName}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.quantity} × {formatCurrency(item.price)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No investments found</p>
                    )}
                </div>

                {/* Withdrawals Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <FaExchangeAlt className="mr-2" /> Withdrawals
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setWithdrawalFilter('all')}
                                className={`px-3 py-1 rounded-full text-sm ${withdrawalFilter === 'all'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                All ({user.financial?.withdrawals?.length || 0})
                            </button>
                            <button
                                onClick={() => setWithdrawalFilter('pending')}
                                className={`px-3 py-1 rounded-full text-sm ${withdrawalFilter === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                Pending ({user.financial?.pendingWithdrawals?.length || 0})
                            </button>
                            <button
                                onClick={() => setWithdrawalFilter('completed')}
                                className={`px-3 py-1 rounded-full text-sm ${withdrawalFilter === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                Completed ({user.financial?.completedWithdrawals?.length || 0})
                            </button>
                        </div>
                    </div>

                    {filteredWithdrawals.length > 0 ? (
                        <div className="space-y-4">
                            {filteredWithdrawals.map((withdrawal, index) => (
                                <div key={index} className="border-b pb-4 last:border-b-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium">{formatCurrency(withdrawal.amount)}</h4>
                                            <p className="text-sm text-gray-500">
                                                {new Date(withdrawal.createdAt).toLocaleString(undefined, {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${withdrawal.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {withdrawal.status}
                                        </span>
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        <div className="bg-gray-50 p-2 rounded">
                                            <p className="text-xs text-gray-500">Net Amount</p>
                                            <p className="font-medium">{formatCurrency(withdrawal.netAmount)}</p>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded">
                                            <p className="text-xs text-gray-500">Fee</p>
                                            <p className="font-medium">{formatCurrency(withdrawal.fee)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No withdrawals found</p>
                    )}
                </div>
            </div>

            {/* Referrals Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <FaUsers className="mr-2" /> Referrals
                    </h3>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                        Total: {user?.referrals?.totalReferrals || 0}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-4 flex items-center">
                            <BiSolidUserDetail className="mr-2" /> Referred By
                        </h4>
                        {user?.referrals?.referredBy?.length > 0 ? (
                            <div>
                                <p className="text-gray-600">{user.referrals.referredBy[0].referrer.email}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">No referrer</p>
                        )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-4 flex items-center">
                            <FaUsers className="mr-2" /> Referred Users
                        </h4>
                        {user?.referrals?.referredUsers?.length > 0 ? (
                            <div className="space-y-2">
                                {user.referrals.referredUsers.map((ref, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <p className="text-gray-600">{ref.referred.email}</p>
                                        <span className={`px-2 py-1 rounded text-xs ${ref.bonusStatus === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {ref.bonusStatus}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No referred users</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center mb-6">
                    <MdSecurity className="mr-2" /> Security Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Password</h4>
                        <p className="text-gray-600">
                            Last changed: {user.security?.passwordLastChanged ?
                                new Date(user.security.passwordLastChanged).toLocaleString(undefined, {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }) :
                                'Never changed'}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Two-Factor Authentication</h4>
                            {user.security?.twoFactorSecret && (
                                <button
                                    onClick={() => setShowSecret(!showSecret)}
                                    className="text-gray-500 hover:text-gray-700"
                                    aria-label={showSecret ? "Hide secret" : "Show secret"}
                                >
                                    {showSecret ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            )}
                        </div>
                        <div className="flex items-center">
                            {user.userInfo?.twoFactorEnabled ? (
                                <>
                                    <FaCheckCircle className="text-green-500 mr-2" />
                                    <span className="text-green-600">Enabled</span>
                                </>
                            ) : (
                                <>
                                    <FaClock className="text-yellow-500 mr-2" />
                                    <span className="text-yellow-600">Not enabled</span>
                                </>
                            )}
                        </div>
                        {user.security?.twoFactorSecret && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500">Secret:</p>
                                <p className="font-mono bg-gray-100 p-2 rounded">
                                    {showSecret ? user.security.twoFactorSecret : '••••••••••••••••'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserData;