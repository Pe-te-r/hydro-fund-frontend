import { useState } from 'react';
import {
    useCancelWithdrawMutation,
    useAllHistoryQuery,
    useApprovalWithdrawMutation
} from '../../slice/withdraw';
import {
    FiRefreshCw,
    FiCheck,
    FiX,
    FiInfo,
    FiDollarSign,
    FiPhone,
    FiUser,
    FiClock,
    FiShield,
    FiAlertCircle
} from 'react-icons/fi';
import { format } from 'date-fns';
import { ApiResponseType, Transaction } from '../../types/type';
import { toast } from 'react-toastify';

export type TransactionStatus = 'pending' | 'completed' | 'rejected';

type TransactionFilter = 'all' | 'pending' | 'completed' | 'rejected';

const rejectionReasons = [
    "Insufficient funds",
    "Suspicious activity",
    "Do more referrals",
    // "Account verification needed",
    "Invalid bank details",
    "Other (please specify)"
];

const AdminWithdrawalsPage = () => {
    const [filter, setFilter] = useState<TransactionFilter>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedPredefinedReason, setSelectedPredefinedReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        data,
        isLoading,
        isError,
        refetch
    } = useAllHistoryQuery(null, {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
        pollingInterval:10000,
    });

    const [cancelWithdrawal] = useCancelWithdrawMutation();
    const [withdrawApproval] = useApprovalWithdrawMutation();

    const filteredTransactions = (data?.data as Transaction[] | undefined)?.filter((transaction: Transaction) => {
        const matchesFilter = filter === 'all' || transaction.status === filter;
        const matchesSearch = searchTerm === '' ||
            transaction.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.phone.includes(searchTerm) ||
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    }) || [];

    const handleApprove = async (id: string) => {
        try {
            const results = await withdrawApproval(id).unwrap();
            toast.success(results.message);
            await refetch();
        } catch (error) {
            const infoError = error as { data: ApiResponseType, status: number };
            toast.error(infoError.data.message);
        }
    };

    const openRejectModal = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setRejectionReason(transaction.admin_info || '');
        setRejectModalOpen(true);
    };

    const closeRejectModal = () => {
        setRejectModalOpen(false);
        setSelectedTransaction(null);
        setRejectionReason('');
        setSelectedPredefinedReason('');
    };

    const handleReasonChange = (reason: string) => {
        setSelectedPredefinedReason(reason);
        if (reason !== "Other (please specify)") {
            setRejectionReason(reason);
        } else {
            setRejectionReason('');
        }
    };

    const handleRejectSubmit = async () => {
        if (!selectedTransaction || (!rejectionReason.trim() && !selectedPredefinedReason)) {
            toast.error('Please select or enter a rejection reason');
            return;
        }

        setIsSubmitting(true);
        try {
            await cancelWithdrawal({
                id: selectedTransaction.id,
                admin: true,
                reason: rejectionReason || selectedPredefinedReason
            }).unwrap();

            toast.success('Withdrawal rejected successfully');
            await refetch();
            closeRejectModal();
        } catch (error) {
            console.error('Failed to reject withdrawal:', error);
            toast.error('Failed to reject withdrawal');
        } finally {
            setIsSubmitting(false);
        }
    };

    const completedTransactions = (data?.data as Transaction[] | undefined)?.filter(
        (t: Transaction) => t.status === 'completed'
    ) || [];

    const totalCompletedAmount = completedTransactions.reduce(
        (sum: number, t: Transaction) => sum + parseFloat(t.amount), 0
    ).toFixed(2);

    const totalCompletedFees = completedTransactions.reduce(
        (sum: number, t: Transaction) => sum + parseFloat(t.fee), 0
    ).toFixed(2);

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-semibold";
        switch (status) {
            case 'pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'completed': return `${baseClasses} bg-green-100 text-green-800`;
            case 'rejected': return `${baseClasses} bg-red-100 text-red-800`;
            default: return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <FiX className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">
                            Failed to load withdrawals. Please try again.
                        </p>
                        <button
                            onClick={() => refetch()}
                            className="mt-2 cursor-pointer text-sm text-red-600 hover:text-red-500"
                        >
                            <FiRefreshCw className="inline mr-1" /> Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Rejection Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Reject Withdrawal Request
                                </h3>
                                <button
                                    onClick={closeRejectModal}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <FiX className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mb-4 space-y-2">
                                <p className="text-sm font-medium text-gray-700">Transaction Details:</p>
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm">
                                        <span className="font-medium">ID:</span> {selectedTransaction?.id}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">User:</span> {selectedTransaction?.user?.email}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Amount:</span>KES {selectedTransaction?.amount}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Date:</span> {selectedTransaction?.createdAt &&
                                            format(new Date(selectedTransaction.createdAt), 'MMM d, yyyy h:mm a')}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select a reason for rejection
                                </label>
                                <div className="space-y-2 mb-3">
                                    {rejectionReasons.map((reason) => (
                                        <div key={reason} className="flex items-center">
                                            <input
                                                id={`reason-${reason}`}
                                                name="rejection-reason"
                                                type="radio"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                checked={selectedPredefinedReason === reason}
                                                onChange={() => handleReasonChange(reason)}
                                            />
                                            <label htmlFor={`reason-${reason}`} className="ml-2 block text-sm text-gray-700">
                                                {reason}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {(selectedPredefinedReason === "Other (please specify)" || !selectedPredefinedReason) && (
                                    <div>
                                        <label htmlFor="custom-reason" className="block text-sm font-medium text-gray-700 mb-1">
                                            {selectedPredefinedReason ? "Please specify:" : "Or enter your reason:"}
                                        </label>
                                        <textarea
                                            id="custom-reason"
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter the reason for rejecting this withdrawal..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            required={!selectedPredefinedReason}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={closeRejectModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRejectSubmit}
                                    className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                    disabled={isSubmitting || (!rejectionReason && !selectedPredefinedReason)}
                                >
                                    {isSubmitting ? 'Processing...' : 'Confirm Rejection'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Withdrawal Management</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Review and manage pending withdrawal requests
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="bg-white shadow rounded-lg p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
                            {(['all', 'pending', 'completed', 'rejected'] as TransactionFilter[]).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 cursor-pointer rounded-md text-sm font-medium whitespace-nowrap ${filter === f
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiInfo className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white shadow rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <FiDollarSign className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Pending</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {(data?.data as Transaction[] | undefined)?.filter((t: Transaction) => t.status === 'pending').length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <FiCheck className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Completed Amount</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    KES {totalCompletedAmount}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <FiShield className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Fees</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    KES {totalCompletedFees}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                                <FiClock className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Completed Today</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {(data?.data as Transaction[] | undefined)
                                        ?.filter((t: Transaction) =>
                                            t.status === 'completed' &&
                                            new Date(t.createdAt).toDateString() === new Date().toDateString()
                                        ).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Transaction
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
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
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction: Transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <FiUser className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{transaction.user?.email}</div>
                                                        <div className="text-sm text-gray-500">
                                                            <FiPhone className="inline mr-1" /> {transaction.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-medium">KES {transaction.amount}</div>
                                                <div className="text-sm text-gray-500">Fee: KES {transaction.fee}</div>
                                                <div className="text-xs text-gray-400 mt-1">ID: {transaction.id.slice(0, 8)}...</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={getStatusBadge(transaction.status)}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <FiClock className="mr-1.5 h-4 w-4 text-gray-400" />
                                                    {format(new Date(transaction.createdAt), 'MMM d, yyyy h:mm a')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {transaction.status === 'pending' && (
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleApprove(transaction.id)}
                                                            className="text-green-600 cursor-pointer hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md text-sm font-medium flex items-center"
                                                        >
                                                            <FiCheck className="mr-1" /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => openRejectModal(transaction)}
                                                            className="text-red-600 cursor-pointer hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium flex items-center"
                                                        >
                                                            <FiX className="mr-1" /> Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {transaction.status === 'rejected' && transaction.admin_info && (
                                                    <div className="text-right">
                                                        <div className="flex items-center justify-end text-red-600 text-sm">
                                                            <FiAlertCircle className="mr-1" />
                                                            <span>Rejected</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1 max-w-xs text-right">
                                                            {transaction.admin_info}
                                                        </div>
                                                    </div>
                                                )}
                                                {transaction.status === 'completed' && (
                                                    <span className="text-gray-400">Completed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No transactions found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Refresh Button */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => refetch()}
                        className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FiRefreshCw className="mr-2 h-4 w-4" />
                        Refresh Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminWithdrawalsPage;