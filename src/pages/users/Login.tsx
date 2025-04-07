/* eslint-disable no-useless-escape */
import { useState } from 'react';
import {
    FiUser,
    FiMail,
    FiPhone,
    FiLock,
    FiArrowRight,
} from 'react-icons/fi';
import {   Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../slice/auth';
import { toast } from 'react-toastify';
import { ErrorResponse } from '../../types/type';

type LoginMethod = 'username' | 'email' | 'phone';

const Login = () => {
    const [activeTab, setActiveTab] = useState<LoginMethod>('email');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Validate based on active tab
        if (activeTab === 'username' && !formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (activeTab === 'email') {
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email';
            }
        }

        if (activeTab === 'phone') {
            if (!formData.phone.trim()) {
                newErrors.phone = 'Phone number is required';
            } else if (!/^[\d\s\+\-\(\)]{10,15}$/.test(formData.phone)) {
                newErrors.phone = 'Please enter a valid phone number';
            }
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [login,] = useLoginMutation();
    const navigate=useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Prepare credentials based on active tab
            const credentials: { email?: string, phone?: string, username?: string, password: string } = {
                password: formData.password
            };

            // Set the appropriate identifier based on active tab
            switch (activeTab) {
                case 'email':
                    credentials.email = formData.email;
                    break;
                case 'username':
                    credentials.username = formData.username;
                    break;
                case 'phone':
                    credentials.phone = formData.phone;
                    break;
            }
            console.log(credentials)
            // Call the login mutation
            const response = await login(credentials).unwrap();

            console.log('Login successful:', response);
            toast.success(response.message)
            
            // Handle successful login (store token, redirect, etc.)
            localStorage.setItem('token', response.data.token);
            
            navigate('/');
        } catch (err) {
            const apiError = err as { status: number; data: ErrorResponse };
            console.log(apiError)
                if (apiError.data) {
                    toast.error(apiError.data.message);
                } else {
                    toast.error('An unknown error occurred');
                }
            }

        finally {
            setIsSubmitting(false);
        }
    };

    const renderInputField = () => {
        switch (activeTab) {
            case 'username':
                return (
                    <div className="space-y-1">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiUser className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-2 border ${errors.username ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="john_doe"
                            />
                        </div>
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>
                );
            case 'email':
                return (
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiMail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="your@email.com"
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                );
            case 'phone':
                return (
                    <div className="space-y-1">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiPhone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="+1 (123) 456-7890"
                            />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
                        <h1 className="text-2xl font-bold">Welcome Back</h1>
                        <p className="opacity-90 mt-1">Sign in to your HydroFund account</p>
                    </div>

                    {/* Login Method Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => setActiveTab('email')}
                            className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'email' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <FiMail className="h-4 w-4" />
                                <span>Email</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('phone')}
                            className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'phone' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <FiPhone className="h-4 w-4" />
                                <span>Phone</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('username')}
                            className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'username' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <FiUser className="h-4 w-4" />
                                <span>Username</span>
                            </div>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Dynamic Input Field */}
                        {renderInputField()}

                        {/* Password Field */}
                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block cursor-pointer text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-800">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex cursor-pointer justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    'Signing in...'
                                ) : (
                                    <>
                                        <span>Sign in</span>
                                        <FiArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Social Login */}
                    {/* <div className="px-6 pb-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FiCreditCard className="h-5 w-5 text-blue-500" />
                                <span className="ml-2">Google</span>
                            </button>
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FiCreditCard className="h-5 w-5 text-blue-500" />
                                <span className="ml-2">Facebook</span>
                            </button>
                        </div>
                    </div> */}

                    {/* Sign Up Link */}
                    <div className="px-6 pb-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;