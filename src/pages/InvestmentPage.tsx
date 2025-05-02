import { useState, useMemo, useEffect } from 'react';
import { FiClock, FiCheckCircle, FiDollarSign, FiCalendar, FiPlusCircle, FiBell } from 'react-icons/fi';
import { format } from 'date-fns';
import { Order, useGetClaimMutation, useGetUserOrdersQuery } from '../slice/invest';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Helper function to format money values
const formatMoney = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
};

const InvestmentPage = () => {
    const { user } = useAuth();
    const userId = user?.id || '';
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const { data: ordersResponse, isLoading, isError,refetch } = useGetUserOrdersQuery(userId,{refetchOnFocus:true,refetchOnMountOrArgChange:true,refetchOnReconnect:true});
    console.log(ordersResponse)

    const orders = useMemo(() => {
        if (!ordersResponse?.data) return [];

        return ordersResponse.data
            .filter(order =>
                activeTab === 'active'
                    ? order.status === 'active'
                    : order.status === 'completed'
            )
            .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    }, [ordersResponse, activeTab]);

    const calculateOrderEarnings = (order: Order) => {
        return order.items.reduce((acc, item) => {
            const daysPassed = Math.floor(
                (new Date().getTime() - new Date(item.createdAt || '').getTime()) / (1000 * 60 * 60 * 24)
            );
            const currentEarnings = Math.min(
                daysPassed * Number(item.dailyIncome) * item.quantity,
                Number(item.totalIncome) * item.quantity
            );
            return acc + currentEarnings;
        }, 0);
    };

    const unclaimedCompletedCount = useMemo(() => {
        if (!ordersResponse?.data) return 0;
        return ordersResponse.data.filter(
            order => order.status === 'completed' && !order.claimed
        ).length;
    }, [ordersResponse]);


    // State for showing notification
    const [showUnclaimedNotification, setShowUnclaimedNotification] = useState(false);

    // Show notification when there are unclaimed orders and user switches to active tab
    useEffect(() => {
        if (activeTab === 'active' && unclaimedCompletedCount > 0) {
            setShowUnclaimedNotification(true);
            // Auto-hide after 5 seconds
            const timer = setTimeout(() => {
                setShowUnclaimedNotification(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [activeTab, unclaimedCompletedCount]);

    const calculateOrderPotential = (order: Order) => {
        return order.items.reduce((acc, item) => acc + (Number(item.totalIncome) * item.quantity), 0);
    };
    const [claimOrder, ] = useGetClaimMutation();


    const handleClaimOrder = async (orderId: string) => {
        try {
            const response = await claimOrder(orderId).unwrap();
            console.log(response)

            if (response.status === 'success') {
                toast.success('Order claimed successfully!');
                await refetch()
                // Consider adding refetch logic here if needed
            } else {
                toast.error(response.message || 'Failed to claim order');
            }
        } catch (error) {
            toast.error('An error occurred while claiming the order');
            console.error('Claim order error:', error);
        }
    };
    if (isLoading) return <div className="flex justify-center py-8">Loading orders...</div>;
    if (isError) return <div className="flex justify-center py-8 text-red-500">Error loading orders</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-2xl font-bold mb-6">My Investments</h1>

            {/* Notification for unclaimed earnings */}
            {showUnclaimedNotification && (
                <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <div className="flex items-start">
                        <FiBell className="text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                        <div>
                            <p className="font-medium text-yellow-800">
                                You have {unclaimedCompletedCount} completed investment{unclaimedCompletedCount > 1 ? 's' : ''} with unclaimed earnings!
                            </p>
                            <p className="text-sm text-yellow-700 mt-1">
                                Switch to the "Completed Investments" tab to claim your earnings.
                            </p>
                            <button
                                onClick={() => {
                                    setActiveTab('completed');
                                    setShowUnclaimedNotification(false);
                                }}
                                className="mt-2 text-sm text-yellow-800 hover:text-yellow-900 font-medium underline"
                            >
                                Go to Completed Investments
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <div className="flex border-b mb-6 relative">
                <button
                    className={`px-4 py-2 font-medium ${activeTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active Investments
                    {unclaimedCompletedCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {unclaimedCompletedCount}
                        </span>
                    )}
                </button>
                <button
                    className={`px-4 py-2 font-medium ${activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed Investments
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <FiPlusCircle className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-500">No {activeTab} investments found</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const currentEarnings = calculateOrderEarnings(order);
                        const potentialEarnings = calculateOrderPotential(order);
                        const isFullyClaimed = order.status === 'completed' && order.claimed;

                        return (
                            <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm bg-white">
                                <div className={`p-4 ${order.status === 'completed' ? 'bg-green-50' : 'bg-blue-50'} flex flex-col md:flex-row justify-between items-start md:items-center`}>
                                    <div className="mb-2 md:mb-0">
                                        <h3 className="font-medium">Order #{order.id?.slice(0, 8)}</h3>
                                        <p className="text-sm text-gray-500">
                                            {format(new Date(order.createdAt!), 'MMM dd, yyyy HH:mm')}
                                        </p>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {order.status === 'completed' ? 'Completed' : 'Active'}
                                        </span>
                                        <span className="font-medium">Cost: {formatMoney(order.totalAmount)}</span>
                                    </div>
                                </div>

                                <div className="p-4 border-t">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center text-gray-500 mb-1">
                                                <FiDollarSign className="mr-2" />
                                                <span className="text-sm">Current Earnings</span>
                                            </div>
                                            <div className="text-xl font-medium">
                                                {formatMoney(currentEarnings)}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center text-gray-500 mb-1">
                                                <FiCalendar className="mr-2" />
                                                <span className="text-sm">Potential Earnings</span>
                                            </div>
                                            <div className="text-xl font-medium">
                                                {formatMoney(potentialEarnings)}
                                            </div>
                                        </div>
                                        {order.status === 'completed' && !isFullyClaimed && (
                                            <button
                                                onClick={() => handleClaimOrder(order.id!)}
                                                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                                            >
                                                <FiCheckCircle className="mr-2" />
                                                Claim Earnings
                                            </button>
                                        )}
                                        {isFullyClaimed && (
                                            <div className="flex items-center justify-center text-green-600">
                                                <FiCheckCircle className="mr-2" />
                                                <span>Claimed</span>
                                            </div>
                                        )}
                                    </div>

                                    <h4 className="font-medium mb-3">Investment Items</h4>
                                    <div className="space-y-4">
                                        {order.items.map((item) => {
                                            const daysPassed = Math.floor(
                                                (new Date().getTime() - new Date(item?.createdAt || '').getTime()) / (1000 * 60 * 60 * 24)
                                            );
                                            const itemCurrentEarnings = Math.min(
                                                daysPassed * Number(item.dailyIncome),
                                                Number(item.totalIncome) * item.quantity
                                            );
                                            const endDate = new Date(item.createdAt || '');
                                            endDate.setDate(endDate.getDate() + item.cycle);
                                            const isItemCompleted = daysPassed >= item.cycle;

                                            return (
                                                <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                                        <div className="mb-2 sm:mb-0">
                                                            <h5 className="font-medium">{item.productName}</h5>
                                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                        </div>
                                                        <span className="font-medium">{formatMoney(item.price)}</span>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                                                        <div className="text-sm">
                                                            <div className="text-gray-500">Daily Income</div>
                                                            <div>{formatMoney(item.dailyIncome)}</div>
                                                        </div>
                                                        <div className="text-sm">
                                                            <div className="text-gray-500">Current Earnings</div>
                                                            <div>{formatMoney(itemCurrentEarnings)}</div>
                                                        </div>
                                                        <div className="text-sm">
                                                            <div className="text-gray-500">Total Potential</div>
                                                            <div>{formatMoney(item.totalIncome)}</div>
                                                        </div>
                                                        <div className="text-sm">
                                                            <div className="text-gray-500">Days Passed</div>
                                                            <div>{Math.min(daysPassed, item.cycle)}/{item.cycle}</div>
                                                        </div>
                                                        <div className="text-sm">
                                                            <div className="text-gray-500">End Date</div>
                                                            <div>{format(endDate, 'MMM dd, yyyy')}</div>
                                                        </div>
                                                        <div className="text-sm">
                                                            <div className="text-gray-500">Status</div>
                                                            <div className={`inline-flex items-center ${isItemCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                                                                {isItemCompleted ? (
                                                                    <>
                                                                        <FiCheckCircle className="mr-1" /> Completed
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FiClock className="mr-1" /> Active
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default InvestmentPage;