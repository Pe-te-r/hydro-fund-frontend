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
    FiClock
} from 'react-icons/fi';
import { useGetAdminDashboardQuery } from '../../slice/dashboard';

const AdminDashboard = () => {
    const { data, error, isLoading } = useGetAdminDashboardQuery(undefined,{refetchOnFocus:true,refetchOnReconnect:true,refetchOnMountOrArgChange:true});
    console.log(data)

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

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 overflow-x-hidden">
            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600 text-sm md:text-base">Overview of platform statistics and activities</p>
            </header>

            {data && (
                <div className="flex flex-col gap-6">
                    {/* Summary Cards - Stack vertically on mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SummaryCard
                            title="Total Users"
                            value={data.data.totals.users}
                            secondaryValue={`${data.data.totals.activeUsers} active`}
                            icon={<FiUsers className="text-blue-600 text-xl" />}
                            bgColor="bg-blue-100"
                        />

                        <SummaryCard
                            title="System Balance"
                            value={`KES ${parseFloat(data.data.totals.systemBalance).toFixed(2)}`}
                            secondaryValue={
                                <div className="flex flex-col space-y-1">
                                    <span className="flex items-center">
                                        <FiUpload className="mr-1" />KES {parseFloat(data.data.totals.totalDeposited).toFixed(2)}
                                    </span>
                                    <span className="flex items-center">
                                        <FiDownload className="mr-1" />KES {parseFloat(data.data.totals.totalWithdrawn).toFixed(2)}
                                    </span>
                                </div>
                            }
                            icon={<FiDollarSign className="text-green-600 text-xl" />}
                            bgColor="bg-green-100"
                        />

                        <SummaryCard
                            title="Investments"
                            value={`KES ${parseFloat(data.data.totals.totalInvested).toFixed(2)}`}
                            secondaryValue={
                                <div className="flex flex-col space-y-1">
                                    <span className="text-green-500">{data.data.totals.activeInvestments} active</span>
                                    <span className="text-blue-500">{data.data.totals.completedInvestments} completed</span>
                                </div>
                            }
                            icon={<FiTrendingUp className="text-purple-600 text-xl" />}
                            bgColor="bg-purple-100"
                        />

                        <SummaryCard
                            title="Total Fees"
                            value={`KES ${parseFloat(data.data.totals.totalFees).toFixed(2)}`}
                            secondaryValue={`From ${data.data.distributions.withdrawals.reduce((acc, curr) => acc + parseInt(curr.count), 0)} withdrawals`}
                            icon={<FiCreditCard className="text-amber-600 text-xl" />}
                            bgColor="bg-amber-100"
                        />
                    </div>

                    {/* Middle Section - Stack vertically on mobile */}
                    <div className="flex flex-col gap-6">
                        {/* VIP Distribution */}
                        <div className="bg-white rounded-xl shadow-md p-6">
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
                                            <span className="capitalize">{vip.tier}</span>
                                            <span>{vip.count} ({Math.round((parseInt(vip.count) / parseInt(data.data.totals.users)) * 100)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${(parseInt(vip.count) / parseInt(data.data.totals.users)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Withdrawal Status */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <FiBarChart2 className="mr-2 text-green-500" /> Withdrawal Status
                                </h2>
                                <span className="text-sm text-gray-500">Total: {data.data.distributions.withdrawals.reduce((acc, curr) => acc + parseInt(curr.count), 0)}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {data.data.distributions.withdrawals.map((item) => (
                                    <div key={item.status} className="bg-gray-50 p-3 rounded-lg">
                                        <div className="text-sm text-gray-500 capitalize">{item.status}</div>
                                        <div className="flex items-end justify-between">
                                            <div className="text-xl font-bold">{item.count}</div>
                                            <div className="text-sm">KES {parseFloat(item.totalAmount).toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                                <FiClock className="mr-2 text-purple-500" /> Recent Withdrawals
                            </h2>
                            <button className="text-sm text-blue-500 hover:text-blue-700">View All</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.data.recentActivity.withdrawals.map((withdrawal) => (
                                <div key={withdrawal.id} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-start">
                                        <div className={`p-2 rounded-lg mr-3 ${withdrawal.status === 'completed' ? 'bg-green-100 text-green-600' :
                                                withdrawal.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-red-100 text-red-600'
                                            }`}>
                                            <FiDownload />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <span className="font-medium">KES {parseFloat(withdrawal.amount).toFixed(2)}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        withdrawal.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {withdrawal.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(withdrawal.createdAt).toLocaleString()}
                                            </div>
                                            {withdrawal.admin_info && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Note: {withdrawal.admin_info}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Stats */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <FiPieChart className="mr-2 text-amber-500" /> Detailed Statistics
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard
                                title="Deposit Ratio"
                                value={`${(parseFloat(data.data.totals.totalDeposited) / (parseFloat(data.data.totals.totalDeposited) + parseFloat(data.data.totals.totalWithdrawn)) * 100).toFixed(1)}%`}
                                change="+2.5%"
                                icon={<FiDownload className="text-blue-500" />}
                            />
                            <StatCard
                                title="Withdrawal Ratio"
                                value={`${(parseFloat(data.data.totals.totalWithdrawn) / (parseFloat(data.data.totals.totalDeposited) + parseFloat(data.data.totals.totalWithdrawn)) * 100).toFixed(1)}%`}
                                change="-1.2%"
                                icon={<FiUpload className="text-green-500" />}
                            />
                            <StatCard
                                title="Fee Percentage"
                                value={`${(parseFloat(data.data.totals.totalFees) / parseFloat(data.data.totals.totalWithdrawn) * 100).toFixed(1)}%`}
                                change="+0.3%"
                                icon={<FiCreditCard className="text-purple-500" />}
                            />
                            <StatCard
                                title="Active Users"
                                value={`${(parseInt(data.data.totals.activeUsers) / parseInt(data.data.totals.users) * 100).toFixed(1)}%`}
                                change="+5.8%"
                                icon={<FiActivity className="text-amber-500" />}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Reusable Summary Card Component
const SummaryCard = ({
    title,
    value,
    secondaryValue,
    icon,
    bgColor = 'bg-gray-100'
}: {
    title: string;
    value: string | number;
    secondaryValue: React.ReactNode;
    icon: React.ReactNode;
    bgColor?: string;
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-start">
                <div className={`${bgColor} p-2 rounded-lg mr-3`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                    <p className="text-xl font-bold text-gray-800">{value}</p>
                    <div className="text-xs text-gray-500 mt-1">
                        {secondaryValue}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) => {
    const isPositive = change.startsWith('+');

    return (
        <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-sm text-gray-500">{title}</div>
                    <div className="text-lg font-bold mt-1">{value}</div>
                </div>
                <div className="bg-white p-1 rounded-lg shadow-sm">
                    {icon}
                </div>
            </div>
            <div className={`text-xs mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {change} from last week
            </div>
        </div>
    );
};

export default AdminDashboard;