import { AdminUser, useGetAdminUsersQuery } from "../../slice/admin/users";

const AdminUsersPage = () => {
    const { data, isLoading, error } = useGetAdminUsersQuery();

    const handleDetailsClick = (userId: string) => {
        console.log("Details clicked for user ID:", userId);
        // You can navigate to a details page or open a modal here
    };

    const handleBlockClick = (userId: string) => {
        console.log("Block clicked for user ID:", userId);
        // You can dispatch an API call to block the user here
    };
    console.log(error)
    if (isLoading) return <div className="p-4 text-center">Loading users...</div>;
    if (error) return <div className="p-4 text-center text-red-500">Error loading users!</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Users</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Balance</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">VIP Tier</th>
                            <th className="py-2 px-4 border-b">Last Login</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data.users.map((user: AdminUser) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b text-center">{user.email}</td>
                                <td className="py-2 px-4 border-b text-center">{user.balance}</td>
                                <td className="py-2 px-4 border-b text-center">{user.status}</td>
                                <td className="py-2 px-4 border-b text-center">{user.vipTier}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    {/* {new Date(user.lastLogin).toLocaleString()} */}
                                    {new Date(user.lastLogin).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })} 
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() => handleDetailsClick(user.id)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Details
                                        </button>
                                        <button
                                            onClick={() => handleBlockClick(user.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Block User
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersPage;