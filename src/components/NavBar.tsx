import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiHome,
    FiInfo,
    FiFileText,
    FiTrendingUp,
    FiDollarSign,
    FiUser,
    FiSettings,
    FiPieChart,
    FiLogOut,
    FiLogIn,
    FiUserPlus,
    FiMenu,
    FiX
    
} from 'react-icons/fi';

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                isAccountDropdownOpen &&
                !target.closest('.account-dropdown') &&
                !target.closest('.account-button')
            ) {
                setIsAccountDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isAccountDropdownOpen]);

    const toggleLogin = () => {
        setIsLoggedIn(!isLoggedIn);
        setIsAccountDropdownOpen(false);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg sticky top-0 z-50">
            <div className="mx-auto w-full md:w-4/5 px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Left side - Logo/Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-white text-2xl font-bold tracking-tight hover:text-blue-200 transition-colors flex items-center">
                                <span className="bg-white/20 p-2 rounded-lg mr-2">
                                    <FiTrendingUp className="text-white" />
                                </span>
                                HydroFund
                            </span>
                        </Link>
                    </div>

                    {/* Middle - Navigation links (desktop) */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-1">
                            <NavLink to="/" icon={<FiHome />} text="Home" />
                            <NavLink to="/about" icon={<FiInfo />} text="About" />
                            {isLoggedIn &&
                                <>
                                <NavLink to="/contract" icon={<FiFileText />} text="Contract" />
                                <NavLink to="/market" icon={<FiTrendingUp />} text="Market" />
                                <NavLink to="/investments" icon={<FiDollarSign />} text="Investments" />
                            </>
                            }
                        </div>
                    </div>

                    {/* Right side - Auth/Account (desktop) */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {!isLoggedIn ? (
                                <div className="flex space-x-2">
                                    <AuthLink
                                        to="/login"
                                        icon={<FiLogIn />}
                                        text="Login"
                                        primary
                                    />
                                    <AuthLink
                                        to="/register"
                                        icon={<FiUserPlus />}
                                        text="Register"
                                    />
                                </div>
                            ) : (
                                <div className="relative account-dropdown">
                                    <button
                                        type="button"
                                        className="account-button flex max-w-xs items-center rounded-full bg-blue-700 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800 hover:bg-blue-600 transition-colors p-1 cursor-pointer"
                                        onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                                            <FiUser className="w-5 h-5" />
                                        </div>
                                    </button>

                                    {isAccountDropdownOpen && (
                                        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
                                            <div className="px-4 py-3">
                                                <p className="text-sm font-medium text-gray-900 truncate">Welcome back!</p>
                                            </div>
                                            <div className="py-1">
                                                <DropdownLink to="/account" icon={<FiUser />} text="Account" />
                                                <DropdownLink to="/dashboard" icon={<FiPieChart />} text="Dashboard" />
                                                <DropdownLink to="/settings" icon={<FiSettings />} text="Settings" />
                                            </div>
                                            <div className="py-1">
                                                <button
                                                    onClick={toggleLogin}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    <FiLogOut className="mr-2" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center space-x-2">
                        {!isLoggedIn ? (
                            <div className="flex space-x-1">
                                <Link
                                    to="/login"
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md text-sm font-medium transition-colors flex items-center cursor-pointer"
                                >
                                    <FiLogIn className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="flex max-w-xs items-center rounded-full bg-blue-700 text-sm focus:outline-none hover:bg-blue-600 transition-colors p-1 cursor-pointer"
                                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                            >
                                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                                    <FiUser className="w-5 h-5" />
                                </div>
                            </button>
                        )}
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800 cursor-pointer"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-blue-700">
                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                        <MobileNavLink to="/" icon={<FiHome />} text="Home" />
                        <MobileNavLink to="/about" icon={<FiInfo />} text="About" />
                        <MobileNavLink to="/contract" icon={<FiFileText />} text="Contract" />
                        <MobileNavLink to="/market" icon={<FiTrendingUp />} text="Market" />
                        <MobileNavLink to="/investments" icon={<FiDollarSign />} text="Investments" />
                    </div>
                    <div className="border-t border-blue-600 pt-4 pb-3">
                        {!isLoggedIn ? (
                            <div className="flex space-x-2 px-2">
                                <AuthLink
                                    to="/login"
                                    icon={<FiLogIn />}
                                    text="Login"
                                />
                                <AuthLink
                                    to="/register"
                                    icon={<FiUserPlus />}
                                    text="Register"
                                    fullWidth
                                    mobile
                                />
                            </div>
                        ) : (
                            <div className="space-y-1 px-2">
                                <MobileDropdownLink to="/account" icon={<FiUser />} text="Account" />
                                <MobileDropdownLink to="/dashboard" icon={<FiPieChart />} text="Dashboard" />
                                <MobileDropdownLink to="/settings" icon={<FiSettings />} text="Settings" />
                                <button
                                    onClick={toggleLogin}
                                    className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-600"
                                >
                                    <FiLogOut className="mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

// Reusable NavLink component
const NavLink = ({ to, icon, text }: { to: string, icon: React.ReactNode, text: string }) => (
    <Link
        to={to}
        className="text-white hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center cursor-pointer group"
    >
        <span className="mr-2 opacity-70 group-hover:opacity-100 transition-opacity">
            {icon}
        </span>
        {text}
    </Link>
);

// Reusable MobileNavLink component
const MobileNavLink = ({ to, icon, text, onClick }: { to: string, icon: React.ReactNode, text: string ,onClick?:()=>null}) => (
    <Link
        to={to}
        className="text-white hover:bg-blue-600  px-3 py-2 rounded-md text-base font-medium flex items-center cursor-pointer"
        onClick={onClick}
    >
        <span className="mr-2">
            {icon}
        </span>
        {text}
    </Link>
);

// Reusable AuthLink component
const AuthLink = ({ to, icon, text, primary = false, fullWidth=false, mobile = false }: { to: string, icon: React.ReactNode, text: string, primary?: boolean,fullWidth?: boolean,mobile?:boolean }) => (
    <Link
        to={to}
        className={`${primary ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 text-blue-600'} 
    ${fullWidth ? 'w-full' : ''} 
    ${mobile ? 'px-3 py-2 text-base' : 'px-4 py-2 text-sm'} 
    rounded-md font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer`}
    >
        {icon}
        <span>{text}</span>
    </Link>
);

// Reusable DropdownLink component
const DropdownLink = ({ to, icon, text }:{to:string,icon:React.ReactNode,text:string}) => (
    <Link
        to={to}
        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center cursor-pointer"
    >
        <span className="mr-2 text-gray-500">
            {icon}
        </span>
        {text}
    </Link>
);

// Reusable MobileDropdownLink component
const MobileDropdownLink = ({ to, icon, text }: { to: string, icon: React.ReactNode, text: string }) => (
    <Link
        to={to}
        className="px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-600 flex items-center cursor-pointer"
    >
        <span className="mr-2">
            {icon}
        </span>
        {text}
    </Link>
);

export default NavBar;