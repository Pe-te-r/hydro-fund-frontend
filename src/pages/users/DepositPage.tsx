import { useState } from 'react';
import { FiSmartphone, FiCreditCard, FiDollarSign, FiCheck, FiArrowRight } from 'react-icons/fi';

export default function DepositPage() {
    const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'paypal' | 'stripe' | 'airtel'>('mpesa');
    const [useSavedNumber, setUseSavedNumber] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Mock user data - replace with actual user context
    const user = {
        phone: '0768543269'
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Deposit request:', {
                method: paymentMethod,
                phone: useSavedNumber ? user.phone : phoneNumber,
                amount: parseFloat(amount),
                currency: 'KES'
            });

            setIsSubmitting(false);
            setShowConfirmation(true);
        }, 1500);
    };

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
        setAmount('');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Deposit Funds</h1>
                    <p className="text-gray-600">Add money to your HydroFund account</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    {/* Payment Method Selection */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Payment Method</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setPaymentMethod('mpesa')}
                                className={`p-3 border rounded-lg flex flex-col items-center ${paymentMethod === 'mpesa'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                    <FiSmartphone className="text-green-600" />
                                </div>
                                <span className="font-medium">M-Pesa</span>
                            </button>

                            <button
                                onClick={() => setPaymentMethod('paypal')}
                                disabled
                                className={`p-3 border rounded-lg flex flex-col items-center ${paymentMethod === 'paypal'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    } opacity-50 cursor-not-allowed`}
                                title="Coming soon"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                    <FiCreditCard className="text-blue-600" />
                                </div>
                                <span className="font-medium">PayPal</span>
                                <span className="text-xs text-gray-500 mt-1">Coming soon</span>
                            </button>

                            <button
                                onClick={() => setPaymentMethod('stripe')}
                                disabled
                                className={`p-3 border rounded-lg flex flex-col items-center ${paymentMethod === 'stripe'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    } opacity-50 cursor-not-allowed`}
                                title="Coming soon"
                            >
                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                                    <FiCreditCard className="text-purple-600" />
                                </div>
                                <span className="font-medium">Stripe</span>
                                <span className="text-xs text-gray-500 mt-1">Coming soon</span>
                            </button>

                            <button
                                onClick={() => setPaymentMethod('airtel')}
                                disabled
                                className={`p-3 border rounded-lg flex flex-col items-center ${paymentMethod === 'airtel'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                    } opacity-50 cursor-not-allowed`}
                                title="Coming soon"
                            >
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2">
                                    <FiSmartphone className="text-red-600" />
                                </div>
                                <span className="font-medium">Airtel Money</span>
                                <span className="text-xs text-gray-500 mt-1">Coming soon</span>
                            </button>
                        </div>
                    </div>

                    {/* M-Pesa Form */}
                    {paymentMethod === 'mpesa' && (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-3">M-Pesa Details</h2>

                                <div className="space-y-4">
                                    {/* Phone Number Selection */}
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <input
                                                type="radio"
                                                id="useSavedNumber"
                                                checked={useSavedNumber}
                                                onChange={() => setUseSavedNumber(true)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="useSavedNumber" className="ml-2 block text-sm font-medium text-gray-700">
                                                Use my saved number: {user.phone}
                                            </label>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="useNewNumber"
                                                checked={!useSavedNumber}
                                                onChange={() => setUseSavedNumber(false)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="useNewNumber" className="ml-2 block text-sm font-medium text-gray-700">
                                                Use a different number
                                            </label>
                                        </div>
                                    </div>

                                    {/* Alternate Phone Number Input */}
                                    {!useSavedNumber && (
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number
                                            </label>
                                            <div className="mt-1 relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">+254</span>
                                                </div>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md py-2"
                                                    placeholder="712345678"
                                                    required={!useSavedNumber}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Amount Input */}
                                    <div>
                                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                            Amount (KES)
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FiDollarSign className="text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                id="amount"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md py-2"
                                                placeholder="0.00"
                                                min="100"
                                                step="100"
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">KES</span>
                                            </div>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Minimum deposit: KES 100</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !amount}
                                className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center ${isSubmitting || !amount ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
                                    }`}
                            >
                                {isSubmitting ? (
                                    'Processing...'
                                ) : (
                                    <>
                                        Deposit Now <FiArrowRight className="ml-2" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Coming Soon Placeholder */}
                    {paymentMethod !== 'mpesa' && (
                        <div className="text-center py-8">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                                <FiClock className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Coming Soon</h3>
                            <p className="text-gray-500">
                                {paymentMethod === 'paypal' && 'PayPal integration will be available soon'}
                                {paymentMethod === 'stripe' && 'Stripe payment processing is coming soon'}
                                {paymentMethod === 'airtel' && 'Airtel Money support is in development'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Transaction History Preview */}
                <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Deposits</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 border-b border-gray-100">
                            <div>
                                <p className="font-medium">M-Pesa Deposit</p>
                                <p className="text-sm text-gray-500">Today, 10:45 AM</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-green-600">+ KES 5,000</p>
                                <p className="text-sm text-gray-500">Completed</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-2 border-b border-gray-100">
                            <div>
                                <p className="font-medium">M-Pesa Deposit</p>
                                <p className="text-sm text-gray-500">Yesterday, 3:22 PM</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-green-600">+ KES 10,000</p>
                                <p className="text-sm text-gray-500">Completed</p>
                            </div>
                        </div>
                    </div>
                    <button className="mt-4 w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View all transactions
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <FiCheck className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Deposit Initiated</h3>
                            <p className="text-gray-500 mb-6">
                                Please check your phone to complete the M-Pesa payment. Your funds will be credited once payment is confirmed.
                            </p>
                            <button
                                onClick={handleConfirmationClose}
                                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}