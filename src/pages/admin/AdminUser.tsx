import { useState } from 'react';
import { toast } from 'react-toastify';
import { AdminUser, useGetAdminUsersQuery, useUpdateUserStatusMutation } from "../../slice/admin/users";
import { useNavigate } from 'react-router-dom';

const AdminUsersPage = () => {
    const { data, isLoading, error, refetch } = useGetAdminUsersQuery(undefined,{refetchOnFocus:true,refetchOnMountOrArgChange:true,refetchOnReconnect:true,pollingInterval:10000});
    const [updateUserStatus] = useUpdateUserStatusMutation();
    const [isBlocking, setIsBlocking] = useState<string | null>(null);

    const handleBlockUser = async (userId: string, currentStatus: string) => {
        setIsBlocking(userId);
        try {
            const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
            await updateUserStatus({
                email: userId, // Assuming email is used as identifier in your API
                status: newStatus
            }).unwrap();

            toast.success(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
            refetch(); // Refresh the user list
        } catch (err) {
            console.log(err)
            toast.error(`Failed to update user status:`);
        } finally {
            setIsBlocking(null);
        }
    };
    const navigate = useNavigate()

    const handleDetails = async(id: string) => {
        navigate(`/admin/users/${id}`)
    }

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );


    if (error) return (
        <div className="p-4 text-center text-red-500">
            Error loading users!
            <button
                onClick={refetch}
                className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Users</h1>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VIP Tier</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data?.data.users.map((user: AdminUser) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES {parseFloat(user.balance).toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.vipTier}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }) : 'Never'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleDetails(user.id)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                                        >
                                            Details
                                        </button>
                                        <button
                                            onClick={() => handleBlockUser(user.id, user.status)}
                                            disabled={isBlocking === user.id}
                                            className={`px-3 py-1 rounded text-xs ${user.status === 'active'
                                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                                } ${isBlocking === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isBlocking === user.id ? (
                                                'Processing...'
                                            ) : user.status === 'active' ? (
                                                'Block'
                                            ) : (
                                                'Unblock'
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="mt-4 sm:hidden">
                {data?.data.users.map((user: AdminUser) => (
                    <div key={user.id} className="bg-white p-4 rounded-lg shadow mb-4">
                        <div className="flex justify-between">
                            <div>
                                <p className="font-medium">{user.email}</p>
                                <p className="text-sm text-gray-500">Balance: {user.balance}</p>
                            </div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {user.status}
                            </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                            <p>VIP: {user.vipTier}</p>
                            <p>Last Login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</p>
                        </div>
                        <div className="mt-3 flex space-x-2">
                            <button
                                onClick={() => handleDetails(user.id)}
                                className="flex-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                            >
                                Details
                            </button>
                            <button
                                onClick={() => handleBlockUser(user.id, user.status)}
                                disabled={isBlocking === user.id}
                                className={`flex-1 px-3 py-1 rounded text-xs ${user.status === 'active'
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                    } ${isBlocking === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isBlocking === user.id ? (
                                    'Processing...'
                                ) : user.status === 'active' ? (
                                    'Block'
                                ) : (
                                    'Unblock'
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminUsersPage;