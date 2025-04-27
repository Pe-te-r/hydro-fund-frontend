import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useGetAllDepositsQuery, useUpdateDepositMutation } from '../../slice/deposit';
import { ErrorResponse } from '../../types/type';

const AdminPendingDeposits = () => {
    const [selectedDeposits, setSelectedDeposits] = useState<string[]>([]);
    const { data, error, isLoading, refetch } = useGetAllDepositsQuery();
    const [updateDeposit] = useUpdateDepositMutation();

    // Auto-refetch every 7 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 7000);
        return () => clearInterval(interval);
    }, [refetch]);

    const handleSelectDeposit = (id: string) => {
        setSelectedDeposits(prev =>
            prev.includes(id)
                ? prev.filter(depositId => depositId !== id)
                : [...prev, id]
        );
    };

    const handleApproveDeposits = async () => {
        if (selectedDeposits.length === 0) {
            toast.warning('Please select at least one deposit to approve');
            return;
        }

        try {
            const promises = selectedDeposits.map(id =>
                updateDeposit({ id }).unwrap()
            );

            await Promise.all(promises);
            toast.success(`${selectedDeposits.length} deposit(s) approved successfully`);
            setSelectedDeposits([]);
            refetch();
        } catch (err) {
            const error = err as {status:number, data:ErrorResponse}
            console.log(error)
            toast.error('Failed to approve deposits');
        }
    };

    if (isLoading) return <div className="text-center py-8">Loading deposits...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error loading deposits</div>;

    const pendingDeposits = data?.data?.filter(deposit => deposit.status === 'pending') || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Pending Deposits</h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">
                            {pendingDeposits.length} pending {pendingDeposits.length === 1 ? 'deposit' : 'deposits'}
                        </span>
                        <button
                            onClick={handleApproveDeposits}
                            disabled={selectedDeposits.length === 0}
                            className={`px-4 py-2 rounded-md text-white ${selectedDeposits.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            Approve Selected ({selectedDeposits.length})
                        </button>
                    </div>
                </div>

                {pendingDeposits.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No pending deposits found
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Select
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Transaction Code
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pendingDeposits.map((deposit) => (
                                    <tr key={deposit.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedDeposits.includes(deposit.id)}
                                                onChange={() => handleSelectDeposit(deposit.id)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                KES {parseFloat(deposit.amount).toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{deposit.user?.email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{deposit.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-900 mr-2">{deposit.code}</span>
                                                <CopyToClipboard
                                                    text={deposit.id}
                                                    onCopy={() => toast.success('deposit id copied to clipboard')}
                                                >
                                                    <button className="text-blue-600 hover:text-blue-800">
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                        </svg>
                                                    </button>
                                                </CopyToClipboard>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {new Date(deposit.createdAt).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    handleSelectDeposit(deposit.id);
                                                    updateDeposit({ id: deposit.id })
                                                        .unwrap()
                                                        .then(() => {
                                                            toast.success('Deposit approved successfully');
                                                            refetch();
                                                        })
                                                        .catch(() => toast.error('Failed to approve deposit'));
                                                }}
                                                className="text-green-600 hover:text-green-900 mr-4"
                                            >
                                                Approve
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPendingDeposits;