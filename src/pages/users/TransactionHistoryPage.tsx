import { useEffect, useState } from 'react';
import {
    FiClock,
    FiCheck,
    FiX,
    FiAlertCircle,
    FiRefreshCw,
    FiInfo,
    FiChevronDown,
    FiChevronUp
} from 'react-icons/fi';
import { useCancelWithdrawMutation,  useHistroyRequestQuery } from '../../slice/withdraw';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

type StatusType = 'pending' | 'completed' | 'rejected' | 'canceled';

interface Transaction {
    id: string;
    amount: string;
    netAmount: string;
    fee: string;
    phone: string;
    status: StatusType;
    createdAt: string;
    processedAt: string | null;
    admin_info?: string | null;
}

export default function TransactionHistoryPage() {
    const { user } = useAuth();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
    const {
        data,
        isLoading,
        error,
        refetch
    } = useHistroyRequestQuery(user?.id || '', {
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: true
    });

    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Toggle row expansion
    const toggleRow = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // Process and sort transactions
    useEffect(() => {
        if (data?.status === 'success') {
            const transactionsData = Array.isArray(data.data) ? data.data : [data.data];
            const sortedTransactions = [...transactionsData].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setTransactions(sortedTransactions);
        }
    }, [data]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refetch();
        } finally {
            setIsRefreshing(false);
        }
    };

    const [cancelWithdraw, { isLoading: isCancelling }] = useCancelWithdrawMutation();

    const handleCancel = async (transactionId: string) => {
        if (window.confirm('Are you sure you want to cancel this transaction?')) {
            try {
                // Execute the mutation
                const result = await cancelWithdraw(transactionId).unwrap();

                if (result.status === 'success') {
                    // Refetch the transaction list on success
                    await refetch();
                    // Optional: Show success message
                    toast.success(result.message || 'Transaction canceled successfully');
                } else {
                    toast.error(result.message || 'Failed to cancel transaction');
                }
            } catch (error) {
                console.error('Cancel failed:', error);
                toast.error('An error occurred while canceling the transaction');
            }
        }
    };

   

    const getStatusBadge = (status: StatusType) => {
        const statusConfig = {
            pending: {
                icon: <FiClock className="text-yellow-500" />,
                color: 'bg-yellow-100 text-yellow-800',
            },
            completed: {
                icon: <FiCheck className="text-green-500" />,
                color: 'bg-green-100 text-green-800',
            },
            rejected: {
                icon: <FiX className="text-red-500" />,
                color: 'bg-red-100 text-red-800',
            },
            canceled: {
                icon: <FiX className="text-red-500" />,
                color: 'bg-red-100 text-red-800',
            },
            default: {
                icon: <FiAlertCircle className="text-gray-500" />,
                color: 'bg-gray-100 text-gray-800',
            },
        };

        const config = statusConfig[status] || statusConfig.default;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon}
                <span className="ml-1 capitalize">{status}</span>
            </span>
        );
    };

    const formatCurrency = (value: string) => {
        return parseFloat(value).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading && !isRefreshing) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FiAlertCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                Failed to load transactions.
                                <button
                                    onClick={handleRefresh}
                                    className="ml-2 text-red-600 font-medium hover:text-red-500"
                                >
                                    Try again
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {isRefreshing ? (
                        <FiRefreshCw className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                        <FiRefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Refresh
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fee
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Net Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => toggleRow(transaction.id)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getStatusBadge(transaction.status)}
                                                    {(transaction.status === 'rejected' || transaction.status === 'canceled') && transaction.admin_info && (
                                                        <button
                                                            className="ml-2 text-gray-400 hover:text-gray-500"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleRow(transaction.id);
                                                            }}
                                                        >
                                                            {expandedRows[transaction.id] ? (
                                                                <FiChevronUp className="h-4 w-4" />
                                                            ) : (
                                                                <FiChevronDown className="h-4 w-4" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(transaction.amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatCurrency(transaction.fee)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                {formatCurrency(transaction.netAmount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(transaction.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {transaction.status === 'pending' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCancel(transaction.id);
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                    disabled={isCancelling}
                                                >
                                                    {isCancelling ? 'Canceling...' : 'Cancel'}
                                                </button>
                                            )}

                                            </td>
                                       {
                                           expandedRows[transaction.id] && transaction.admin_info && (
                                            <td className="bg-gray-50">
                                                <td colSpan={7} className="px-6 py-4">
                                                    <div className="flex items-start">
                                                        <FiInfo className="flex-shrink-0 h-5 w-5 text-blue-400 mt-0.5" />
                                                        <div className="ml-3">
                                                            <p className="text-sm font-medium text-gray-900">Admin Note</p>
                                                            <p className="text-sm text-gray-500 whitespace-pre-wrap">
                                                                {transaction.admin_info}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </td>
                                        )
                                    }
                                    </tr>
                                     
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                <p>Note: Only pending transactions can be canceled. Processing may take 1-3 business days.</p>
                {transactions.some(t => t.status === 'rejected' && t.admin_info) && (
                    <p className="mt-2">
                        <FiInfo className="inline mr-1 text-blue-400" />
                        Click on rejected transactions to view admin notes
                    </p>
                )}
            </div>
        </div>
    );
}