import { useState } from 'react';
import { FiSmartphone, FiCreditCard, FiDollarSign, FiCheck, FiClock, FiArrowLeft, FiUser, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateDepositMutation } from '../../slice/deposit';
import { useAuth } from '../../context/AuthContext';
import { ErrorResponse } from '../../types/type';
import CopyToClipboard from 'react-copy-to-clipboard';

export default function DepositPage() {
    const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'paypal' | 'stripe' | 'airtel'>('mpesa');
    const [mpesaMethod, setMpesaMethod] = useState<'manual' | 'automatic'>('manual');
    const [amount, setAmount] = useState('');
    const [isSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Deposit verification states
    const [showDepositVerification, setShowDepositVerification] = useState(false);
    const [depositPhone, setDepositPhone] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [verificationMethod, setVerificationMethod] = useState<'whatsapp' | 'notification' | null>(null);
    const [transactionCode, setTransactionCode] = useState('');

    const WHATSAPP_LINK = 'https://wa.me/message/ICQPLKGQUJAGM1';

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
        setAmount('');
    };

    const [sendDeposit, { isLoading }] = useCreateDepositMutation();
    const { user } = useAuth();

    const handleDepositVerificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (verificationMethod === 'whatsapp') {
            window.open(WHATSAPP_LINK, '_blank');
            toast.info('You will be redirected to WhatsApp. Please send your deposit details to admin for faster processing.');
            return;
        }

        if (verificationMethod === 'notification') {
            if (!depositPhone || !depositAmount || !transactionCode) {
                toast.error('Please provide all required details');
                return;
            }

            try {
                const results = await sendDeposit({
                    amount: depositAmount,
                    code: transactionCode,
                    phone: depositPhone,
                    userId: user?.id || ''
                }).unwrap();

                toast.success(results.message || 'Deposit verification submitted. Admin will process your request shortly.');

                // Reset form on success
                setDepositPhone('');
                setDepositAmount('');
                setTransactionCode('');
                setVerificationMethod(null);
                setShowDepositVerification(false);

            } catch (err) {
                const error = err as {status:number,data:ErrorResponse}
                console.log(error)
                toast.error(error.data.message || 'Failed to submit deposit verification. Please try again.');
                // Don't reset form on error so user can try again
            }
        }
    };

    return (
        <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Header with navigation buttons */}
            <div className="max-w-md mx-auto mt-3 mb-6 flex justify-between items-center">
                <Link
                    to="/investments"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <FiArrowLeft className="mr-1" />
                    Back to Investments
                </Link>
                <Link
                    to="/account"
                    className="flex items-center text-gray-700 hover:text-gray-900"
                >
                    <FiUser className="mr-1" />
                    Account
                </Link>
            </div>

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
                        <div>
                            {/* M-Pesa Method Tabs */}
                            <div className="flex border-b border-gray-200 mb-4">
                                <button
                                    onClick={() => setMpesaMethod('manual')}
                                    className={`py-2 px-4 font-medium text-sm ${mpesaMethod === 'manual'
                                        ? 'border-b-2 border-blue-500 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Paybill Manual
                                </button>
                                <button
                                    onClick={() => setMpesaMethod('automatic')}
                                    className={`py-2 px-4 font-medium text-sm ${mpesaMethod === 'automatic'
                                        ? 'border-b-2 border-blue-500 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Automatic Pay
                                </button>
                            </div>

                            {/* Manual Paybill Instructions */}
                            {mpesaMethod === 'manual' && (
                                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                    <h3 className="font-medium text-blue-800 mb-2">Manual Paybill Instructions</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                        <li>Go to M-Pesa on your phone</li>
                                        <li>Select <strong>Lipa na M-Pesa</strong></li>
                                        <li>Select <strong>Pay Bill</strong></li>
                                        <li>Enter Business Number: <strong>714888</strong></li>
                                        <li>Enter Account Number: <strong>161494</strong></li>
                                        <li>Enter Amount: <strong>KES {amount || '___'}</strong></li>
                                        <li>Enter your M-Pesa PIN</li>
                                        <li>Confirm and send</li>
                                    </ol>

                                    <div className="mt-4 p-3 bg-white rounded-md border border-blue-200">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-600">Business Number:</span>
                                            <span className="font-medium">714888</span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-600">Account Number:</span>
                                            <span className="font-medium">161494</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Amount:</span>
                                            <span className="font-medium">KES {amount || '0.00'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                           
                            {/* Automatic Pay (Coming Soon) */}
                            {mpesaMethod === 'automatic' && (
                                <div className="text-center py-8">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                                        <FiClock className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">Coming Soon</h3>
                                    <p className="text-gray-500">
                                        Automatic M-Pesa payments will be available soon
                                    </p>
                                </div>
                            )}

                            {/* Amount Input */}
                            <div className="mb-4">
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

                            {/* Submit Button */}
                            <button
                                onClick={() => setShowConfirmation(true)}
                                disabled={mpesaMethod !== 'automatic'}
                                className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg ${mpesaMethod === 'manual' ? 'opacity-75 cursor-not-allowed' : !amount ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                            >
                                {isSubmitting ? 'Processing...' : 'Confirm Deposit'}
                            </button>
                        </div>
                    )}

                    {/* Other Payment Methods Placeholder */}
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

                {/* Deposit Verification Section */}
                {paymentMethod === 'mpesa' && mpesaMethod === 'manual' && (
                    <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Deposit Not Reflected?</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            If you've made a payment but it's not showing in your account, verify it with us for faster processing.
                            <span className="block font-medium mt-1">Please provide accurate details for quick resolution.</span>
                        </p>

                        {!showDepositVerification ? 
                            (<div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setVerificationMethod('whatsapp');
                                        setShowDepositVerification(true);
                                    }}
                                    className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 flex items-center justify-center"
                                >
                                    <FiMessageSquare className="mr-2" />
                                    Chat Admin on WhatsApp
                                </button>
                                <button
                                    onClick={() => {
                                        setVerificationMethod('notification');
                                        setShowDepositVerification(true);
                                    }}
                                    className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                                >
                                    Send Notification to Admin
                                </button>
                            </div>): 
                            (verificationMethod === 'whatsapp' ?
                                (<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-blue-800 font-medium mb-3">
                                        Please send this exact message format to WhatsApp for faster processing:
                                    </p>

                                    <div className="mt-2 p-3 bg-white rounded border border-blue-200">
                                        <div className="font-mono text-sm space-y-2">
                                            <p className="font-semibold">Deposit Verification Request</p>
                                            <p>📱 Phone: <span className="font-bold">{depositPhone || '[Your M-Pesa Number]'}</span></p>
                                            <p>💰 Amount: <span className="font-bold">KES {depositAmount || '[Amount Deposited]'}</span></p>
                                            <p>🔢 Transaction Code: <span className="font-bold">{transactionCode || '[M-Pesa Code]'}</span></p>
                                            <p>📅 Date: <span className="font-bold">{new Date().toLocaleDateString()}</span></p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-blue-100">
                                            <p className="text-xs text-blue-600">
                                                Tip: Copy this message and paste it in WhatsApp after clicking the button below.
                                            </p>
                                        </div>
                                    </div>

                                    <CopyToClipboard
                                        text={`Deposit Verification Request\n📱 Phone: ${depositPhone || '[Your M-Pesa Number]'}\n💰 Amount: KES ${depositAmount || '[Amount Deposited]'}\n🔢 Transaction Code: ${transactionCode || '[M-Pesa Code]'}\n📅 Date: ${new Date().toLocaleDateString()}`}
                                        onCopy={() => toast.success('Message copied to clipboard!')}
                                    >
                                        <button className="mt-3 w-full py-2 px-4 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center justify-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                            </svg>
                                            Copy Message Template
                                        </button>
                                    </CopyToClipboard>

                                    <div className="flex space-x-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowDepositVerification(false);
                                                setVerificationMethod(null);
                                            }}
                                            className="flex-1 py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : (
                                                verificationMethod === 'whatsapp' && 'Open WhatsApp'
                                            )}
                                        </button>
                                    </div>

                                    
                                </div>
                             ):(
                                <form onSubmit={handleDepositVerificationSubmit}>
                                    <div className="space-y-4">
                                        {verificationMethod === 'notification' && (
                                            <>
                                                <div>
                                                    <label htmlFor="depositPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Phone Number Used for Payment
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        id="depositPhone"
                                                        value={depositPhone}
                                                        onChange={(e) => setDepositPhone(e.target.value)}
                                                        className="block w-full p-3 border border-gray-300 rounded-md sm:text-sm"
                                                        placeholder="07XXXXXXXX"
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-1">
                                                        Amount Deposited (KES)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="depositAmount"
                                                        value={depositAmount}
                                                        onChange={(e) => setDepositAmount(e.target.value)}
                                                        className="block w-full p-3 border border-gray-300 rounded-md sm:text-sm"
                                                        placeholder="0.00"
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="transactionCode" className="block text-sm font-medium text-gray-700 mb-1">
                                                        M-Pesa Transaction Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="transactionCode"
                                                        value={transactionCode}
                                                        onChange={(e) => setTransactionCode(e.target.value)}
                                                        className="block w-full p-3 border border-gray-300 rounded-md sm:text-sm"
                                                        placeholder="e.g. MGS123456789"
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                            </>
                                        )}


                                        <div className="flex space-x-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowDepositVerification(false);
                                                    setVerificationMethod(null);
                                                }}
                                                className="flex-1 py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                                                disabled={isLoading}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    verificationMethod === 'notification'&& 'Submit Notification'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>)
                        )}
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <FiCheck className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {mpesaMethod === 'manual' ? 'Payment Instructions' : 'Deposit Initiated'}
                            </h3>

                            {mpesaMethod === 'manual' ? (
                                <>
                                    <div className="bg-blue-50 rounded-lg p-4 mb-4 text-left">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Business Number:</span>
                                            <span className="font-medium">714888</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Account Number:</span>
                                            <span className="font-medium">161494</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Amount:</span>
                                            <span className="font-medium">KES {amount}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 mb-4">
                                        Please complete the payment via M-Pesa Paybill using the details above.
                                    </p>
                                </>
                            ) : (
                                <p className="text-gray-500 mb-6">
                                    Please check your phone to complete the M-Pesa payment. Your funds will be credited once payment is confirmed.
                                </p>
                            )}

                            <button
                                onClick={handleConfirmationClose}
                                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                {mpesaMethod === 'manual' ? 'I\'ve Completed Payment' : 'Done'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}