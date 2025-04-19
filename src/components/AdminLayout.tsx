import { ReactNode, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile view
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close sidebar when clicking on a link in mobile view
    const handleLinkClick = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header with Toggle Button */}
            <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-20">
                <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 cursor-pointer rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            <div className="flex">
                {/* Sidebar Navigation - Hidden on mobile unless toggled */}
                <div 
                    className={`${sidebarOpen ? 'block' : 'hidden'} md:block ${sidebarOpen ? 'w-1/2 mt-30':''} bg-white shadow-md h-[calc(100vh-64px)] sm:h-screen fixed md:sticky top-0 md:top-0 z-10 transition-all duration-300 ease-in-out`}
                >
                    <div className="p-4">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4 hidden md:block">Admin Dashboard</h2>
                        <nav className="space-y-2">
                            <Link
                                to="/admin"
                                onClick={handleLinkClick}
                                className="block cursor-pointer px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded transition"
                            >
                                Overview
                            </Link>
                            <Link
                                to="/admin/users"
                                onClick={handleLinkClick}
                                className="block cursor-pointer px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded transition"
                            >
                                User Management
                            </Link>
                            <Link
                                to="/admin/withdrawals"
                                onClick={handleLinkClick}
                                className="block cursor-pointer px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded transition"
                            >
                                Transactions
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area - Adjust margin based on sidebar state */}
                <div 
                    className={`flex-1 p-4 md:p-8 transition-all duration-300 ${sidebarOpen ? 'ml-64 md:ml-0' : 'ml-0'}`}
                >
                     {/* Overlay for mobile when sidebar is open */}
                    {/* {sidebarOpen && isMobile && (
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}  */}
                    
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;