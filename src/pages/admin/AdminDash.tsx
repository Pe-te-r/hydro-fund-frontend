import {
    FiUsers,
    FiActivity,
    FiDollarSign,
    FiTrendingUp,
    FiPieChart,
    FiDownload,
    FiUpload,
    FiCreditCard,
    FiAward,
    FiBarChart2,
    FiClock,
    FiRefreshCw
} from 'react-icons/fi';
import { useGetAdminDashboardQuery } from '../../slice/dashboard';
import { useState } from 'react';

const formatKES = (amount: string) => {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(parseFloat(amount));
};

const AdminDashboard = () => {
    const { data, error, isLoading, refetch } = useGetAdminDashboardQuery(undefined, {
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: true,
        pollingInterval:10000
    });
    const [activeTab, setActiveTab] = useState<'withdrawals' | 'investments'>('investments');


    if (isLoading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Error loading dashboard data
            </div>
        </div>
    );

    // Calculate completed withdrawals data
    const completedWithdrawals = data?.data.distributions.withdrawals.find(w => w.status === 'completed') || {
        count: "0",
        totalAmount: "0"
    };
    // Calculate completed fees (assuming fee is 1.5% of completed withdrawals)
    const completedFees = (parseFloat(data?.data?.totals?.totalFees || '')).toFixed(2);
    console.log('here', completedWithdrawals)

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 overflow-x-hidden">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-600 text-sm md:text-base">Overview of platform statistics and activities</p>
                </div>
                <button
                    onClick={refetch}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition-colors"
                >
                    <FiRefreshCw className={`${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </header>

            {data && (
                <div className="flex flex-col gap-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SummaryCard
                            title="Total Users"
                            value={data.data.totals.users}
                            secondaryValue={`${data.data.totals.activeUsers} active`}
                            icon={<FiUsers className="text-blue-600 text-xl" />}
                            trend={`${((parseInt(data.data.totals.activeUsers) / parseInt(data.data.totals.users)) * 100)}% active`}
                            trendPositive={true}
                        />

                        <SummaryCard
                            title="System Balance"
                            value={formatKES(data.data.totals.systemBalance)}
                            secondaryValue={
                                <div className="flex flex-col space-y-1 text-xs">
                                    <span className="flex items-center text-green-600">
                                        <FiUpload className="mr-1" /> {formatKES(data.data.totals.totalDeposited)}
                                    </span>
                                    <span className="flex items-center text-red-600">
                                        <FiDownload className="mr-1" /> {formatKES(data.data.totals.totalWithdrawn)}
                                    </span>
                                </div>
                            }
                            icon={<FiDollarSign className="text-green-600 text-xl" />}
                            trend={`${parseFloat(data.data.totals.totalDeposited) > 0
                                ? ((parseFloat(data.data.totals.totalWithdrawn) / parseFloat(data.data.totals.totalDeposited)) * 100)
                                : 0}% outflow`}

                            trendPositive={parseFloat(data.data.totals.systemBalance) > parseFloat(data.data.totals.totalWithdrawn)}
                        />

                        <SummaryCard
                            title="Total Investments"
                            value={formatKES(data.data.totals.totalInvested)}
                            secondaryValue={
                                <div className="flex flex-col space-y-1 text-xs">
                                    <span>
                                        {data.data.distributions.investments.find(i => i.status === 'active')?.count || '0'} active
                                    </span>
                                    <span>
                                        {data.data.distributions.investments.find(i => i.status === 'completed')?.count || '0'} completed
                                    </span>
                                </div>
                            }
                            icon={<FiTrendingUp className="text-purple-600 text-xl" />}
                            trend={`${data.data.distributions.investments.length > 0
                                    ? (
                                        parseInt(
                                            data.data.distributions.investments.find(i => i.status === 'active')?.count || '0'
                                        ) /
                                        data.data.distributions.investments.reduce(
                                            (acc, curr) => acc + parseInt(curr.count),
                                            0
                                        )
                                    ) * 100
                                    : 0
                                }% active`}

                            trendPositive={true}
                        />

                        <SummaryCard
                            title="Transaction Fees"
                            value={formatKES(completedFees)}
                            secondaryValue={`From ${completedWithdrawals.count} completed withdrawals`}
                            icon={<FiCreditCard className="text-amber-600 text-xl" />}
                            trend="10% fee rate"
                            trendPositive={parseFloat(completedFees) > 0}
                        />
                    </div>

                    {/* Middle Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* VIP Distribution */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <FiAward className="mr-2 text-blue-500" /> VIP Distribution
                                </h2>
                                <span className="text-sm text-gray-500">Total: {data.data.totals.users}</span>
                            </div>
                            <div className="space-y-3">
                                {data.data.distributions.vip.map((vip) => (
                                    <div key={vip.tier} className="mb-2">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="capitalize font-medium">{vip.tier}</span>
                                            <span>{vip.count} ({Math.round((parseInt(vip.count) / parseInt(data.data.totals.users)) * 100)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                                                style={{ width: `${(parseInt(vip.count) / parseInt(data.data.totals.users)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Withdrawal Status */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <FiBarChart2 className="mr-2 text-green-500" /> Withdrawal Status
                                </h2>
                                <span className="text-sm text-gray-500">Total: {data.data.distributions.withdrawals.reduce((acc, curr) => acc + parseInt(curr.count), 0)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {data.data.distributions.withdrawals.map((item) => (
                                    <div key={item.status} className={`p-3 rounded-lg border ${item.status === 'completed' ? 'border-green-100 bg-green-50' :
                                            item.status === 'pending' ? 'border-amber-100 bg-amber-50' :
                                                'border-red-100 bg-red-50'
                                        }`}>
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{item.status}</div>
                                        <div className="flex items-end justify-between">
                                            <div className="text-xl font-bold">{item.count}</div>
                                            <div className="text-sm font-medium">{formatKES(item.totalAmount)}</div>
                                        </div>
                                        {item.status === 'completed' && (
                                            <div className="text-xs text-gray-500 mt-1">Fees: {formatKES((parseFloat(item.totalAmount) * 0.015).toFixed(2))}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                <FiClock className="mr-2 text-purple-500" /> Recent Activity
                            </h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setActiveTab('withdrawals')}
                                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${activeTab === 'withdrawals'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                >
                                    Withdrawals
                                </button>
                                <button
                                    onClick={() => setActiveTab('investments')}
                                    className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${activeTab === 'investments'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                >
                                    Investments
                                </button>
                            </div>
                        </div>

                        {activeTab === 'withdrawals' ? (
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                                    <FiDownload className="mr-2" /> Recent Withdrawals
                                </h3>
                                {data.data.recentActivity.withdrawals.length > 0 ? (
                                    data.data.recentActivity.withdrawals.slice(0, 5).map((withdrawal) => (
                                        <div key={withdrawal.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                                            <div className={`p-2 rounded-lg mr-3 ${withdrawal.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                    withdrawal.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                                        'bg-red-100 text-red-600'
                                                }`}>
                                                <FiDownload />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{formatKES(withdrawal.amount)}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            withdrawal.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {withdrawal.status}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    <div className="flex justify-between">
                                                        <span>User ID: {withdrawal.userId.substring(0, 8)}...</span>
                                                        <span>{new Date(withdrawal.createdAt || '').toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className="block">Email: {withdrawal.user?.email || 'N/A'}</span>
                                                        <span className="block">Phone: {withdrawal.user?.phone || withdrawal.phone || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                {withdrawal.admin_info && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Admin Note: {withdrawal.admin_info}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        No recent withdrawal activity
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                                    <FiTrendingUp className="mr-2" /> Recent Investments
                                </h3>
                                {data.data.recentActivity.investments.length > 0 ? (
                                    data.data.recentActivity.investments.slice(0, 5).map((investment) => (
                                        <div key={investment.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                                            <div className={`p-2 rounded-lg mr-3 ${investment.status === 'active' ? 'bg-green-100 text-green-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                <FiActivity />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{formatKES(investment.totalAmount)}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${investment.status === 'active' ? 'bg-green-100 text-green-800' :
                                                            'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {investment.status}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    <div className="flex justify-between">
                                                        <span>User ID: {investment.userId.substring(0, 8)}...</span>
                                                        <span>{new Date(investment.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="mt-1">
                                                        <span className="block">Email: {investment.user?.email || 'N/A'}</span>
                                                        <span className="block">Phone: {investment.user?.phone || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        No recent investment activity
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Analytics Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Financial Ratios */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FiPieChart className="mr-2 text-amber-500" /> Financial Ratios
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <RatioCard
                                    title="Deposit/Withdrawal"
                                    value={parseFloat(data.data.totals.totalDeposited) > 0 ?
                                        (parseFloat(data.data.totals.totalWithdrawn) / parseFloat(data.data.totals.totalDeposited) * 100) : 0}
                                    unit="%"
                                    description="Withdrawal percentage of deposits"
                                    trend={parseFloat(data.data.totals.totalWithdrawn) / parseFloat(data.data.totals.totalDeposited) > 0.5 ? 'high' : 'low'}
                                />
                                <RatioCard
                                    title="Fee Efficiency"
                                    value={parseFloat(completedFees)}
                                    unit="KES"
                                    description="Fees from completed withdrawals"
                                    trend={parseFloat(completedFees) > 1000 ? 'high' : 'low'}
                                />
                                <RatioCard
                                    title="Investment Rate"
                                    value={parseFloat(data.data.totals.totalInvested) > 0 ?
                                        (parseFloat(data.data.totals.totalInvested) / parseFloat(data.data.totals.totalDeposited)) * 100 : 0}
                                    unit="%"
                                    description="Invested percentage of deposits"
                                    trend={parseFloat(data.data.totals.totalInvested) / parseFloat(data.data.totals.totalDeposited) > 0.7 ? 'high' : 'low'}
                                />
                                <RatioCard
                                    title="Active Users"
                                    value={(parseInt(data.data.totals.activeUsers) / parseInt(data.data.totals.users)) * 100}
                                    unit="%"
                                    description="Percentage of active users"
                                    trend={parseInt(data.data.totals.activeUsers) / parseInt(data.data.totals.users) > 0.5 ? 'high' : 'low'}
                                />
                            </div>
                        </div>

                        {/* Growth Metrics */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FiActivity className="mr-2 text-green-500" /> User Growth
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-500">New Users Today</div>
                                        <div className="text-2xl font-bold">
                                            {data.data.growth.users.find(u => u.date === new Date().toISOString().split('T')[0])?.count || '0'}
                                        </div>
                                    </div>
                                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        +{data.data.growth.users.length} days
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="grid grid-cols-5 gap-2 text-center">
                                        {data.data.growth.users.slice(0, 5).map((day) => (
                                            <div key={day.date} className="flex flex-col items-center">
                                                <div className="text-xs text-gray-500">
                                                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                </div>
                                                <div className="font-medium">{day.count}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-32 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center text-gray-400">
                                    [User Growth Chart Placeholder]
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Enhanced Summary Card Component
const SummaryCard = ({
    title,
    value,
    secondaryValue,
    icon,
    trend,
    trendPositive
}: {
    title: string;
    value: string | React.ReactNode;
    secondaryValue: React.ReactNode;
    icon: React.ReactNode;
    trend?: string;
    trendPositive?: boolean;
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg mr-3 ${trendPositive ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                    }`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                    <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
                    <div className="text-xs text-gray-500 mt-2">
                        {secondaryValue}
                    </div>
                    {trend && (
                        <div className={`text-xs mt-2 ${trendPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {trend}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Ratio Card Component
const RatioCard = ({
    title,
    value,
    unit,
    description,
    trend
}: {
    title: string;
    value: number;
    unit: string;
    description: string;
    trend: 'high' | 'low';
}) => {
    return (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{title}</div>
            <div className="text-xl font-bold mb-1">
                {value.toFixed(1)}{unit}
            </div>
            <div className="text-xs text-gray-500">{description}</div>
            <div className={`text-xs mt-2 ${trend === 'high' ? 'text-green-600' : 'text-blue-600'
                }`}>
                {trend === 'high' ? 'Above average' : 'Below average'}
            </div>
        </div>
    );
};

export default AdminDashboard;