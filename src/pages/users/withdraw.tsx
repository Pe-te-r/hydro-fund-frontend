import { useState, useEffect } from 'react';
import { FiArrowLeft, FiDollarSign, FiSmartphone, FiCheck, FiAlertCircle, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useWithdrawQuery } from '../../slice/withdraw';
import { useAuth } from '../../context/AuthContext';

export default function WithdrawPage() {
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [amountError, setAmountError] = useState('');
    const [useAlternativeNumber, setUseAlternativeNumber] = useState(false);
    const [alternativeNumber, setAlternativeNumber] = useState('');

    // Constants
    const MIN_WITHDRAWAL = 100;
    const MAX_WITHDRAWAL = 5000;
    const TRANSACTION_FEE_PERCENTAGE = 0.08;

    
    const {user:userData} = useAuth()
    const { data } = useWithdrawQuery(userData ?.id || '')
    type User = {
        phone: string;
        balance: number;
        withdrawable:number;
    };

    const [user, setUser] = useState<User>({
        phone: '',
        balance: 0,
        withdrawable: 0.00
    });

   

    useEffect(() => {
        if (data?.data) {
            const info = data.data;
            console.log(info)
            const maxAfterFee = info.amount / (1 + TRANSACTION_FEE_PERCENTAGE);
            const withdrawable = Math.min(maxAfterFee, MAX_WITHDRAWAL);
            setUser({ phone: info.phone, balance: info.amount, withdrawable });
        }
    }, [data]);


    // Calculate transaction fee
    const transactionFee = amount ? parseFloat(amount) * TRANSACTION_FEE_PERCENTAGE : 0;
    const willReceive = amount ? parseFloat(amount) - transactionFee : 0;
    const totalDeduction = amount ? parseFloat(amount) + transactionFee : 0;

    useEffect(() => {
        if (!amount) {
            setAmountError('');
            return;
        }

        const amountNum = parseFloat(amount);

        if (isNaN(amountNum)) {
            setAmountError('Please enter a valid amount');
        } else if (amountNum < MIN_WITHDRAWAL) {
            setAmountError(`Minimum withdrawal is Ksh ${MIN_WITHDRAWAL.toLocaleString()}`);
        } else if (amountNum > MAX_WITHDRAWAL) {
            setAmountError(`Maximum withdrawal per transaction is Ksh ${MAX_WITHDRAWAL.toLocaleString()}`);
        } else if (totalDeduction > user.balance) {
            setAmountError(`Insufficient balance after fee deduction`);
        } else {
            setAmountError('');
        }
    }, [amount]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (amountError) {
            toast.error(amountError, { position: 'top-center' });
            return;
        }

        if (useAlternativeNumber && !alternativeNumber) {
            toast.error('Please enter a valid M-Pesa number', { position: 'top-center' });
            return;
        }

        setIsSubmitting(true);

        try {
            // This would be the actual API call when you implement it
            // const result = await useWithdrawQuery(amount).unwrap();

            // For now, we'll simulate the API response
            const withdrawalData = {
                phone: useAlternativeNumber ? alternativeNumber : user.phone,
                amount: parseFloat(amount),
                fee: transactionFee,
                netAmount: willReceive,
                currency: 'KES'
            };

            console.log('Withdrawal request:', withdrawalData);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsSubmitting(false);
            setShowConfirmation(true);

        } catch (error) {
            console.error('Withdrawal failed:', error);
            toast.error('Withdrawal request failed. Please try again.', { position: 'top-center' });
            setIsSubmitting(false);
        }
    };

    const handleConfirmationClose = () => {
        setShowConfirmation(false);
        setAmount('');
        setAlternativeNumber('');
        setUseAlternativeNumber(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            {/* Header with navigation */}
            <div className="max-w-md mx-auto mb-6">
                <Link
                    to="/account"
                    className="flex items-center text-blue-600 hover:text-blue-800 w-fit"
                >
                    <FiArrowLeft className="mr-1" />
                    Back to Account
                </Link>
            </div>

            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Withdraw Funds</h1>
                    <p className="text-gray-600">Transfer money to your M-Pesa account</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Balance Summary */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium">Available Balance</p>
                                <p className="text-2xl font-bold">Ksh {Number(user.balance).toFixed(2).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Withdrawable*</p>
                                <p className="text-2xl font-bold">Ksh {user.withdrawable.toFixed(2)}</p>
                            </div>
                        </div>
                        <p className="text-xs mt-2 opacity-80">*After 8% transaction fee deduction</p>
                    </div>

                    {/* Withdrawal Form */}
                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {/* Phone Number Display */}
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Withdrawal Details</h2>
                                    <div className="space-y-3">
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-blue-100 rounded-full mr-3">
                                                    <FiSmartphone className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Registered M-Pesa Number</p>
                                                    <p className="font-medium text-gray-900">{user.phone}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Alternative number option */}
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="useAlternativeNumber"
                                                checked={useAlternativeNumber}
                                                onChange={(e) => setUseAlternativeNumber(e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="useAlternativeNumber" className="ml-2 block text-sm text-gray-700">
                                                Withdraw to another number
                                            </label>
                                        </div>

                                        {useAlternativeNumber && (
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiSmartphone className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    value={alternativeNumber}
                                                    onChange={(e) => setAlternativeNumber(e.target.value)}
                                                    className="block w-full pl-8 pr-12 py-3 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md sm:text-sm"
                                                    placeholder="07XXXXXXXX"
                                                    disabled={!useAlternativeNumber}
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">Coming Soon</span>
                                                    <FiLock className="ml-1 text-gray-400" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Withdrawals to registered number are processed immediately. Alternative numbers coming soon.
                                    </p>
                                </div>

                                {/* Amount Input */}
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                        Amount (Ksh)
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
                                            className={`block w-full pl-8 pr-12 py-3 border ${amountError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md sm:text-sm`}
                                            placeholder="0.00"
                                            min={MIN_WITHDRAWAL}
                                            max={MAX_WITHDRAWAL}
                                            step="10"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">Ksh</span>
                                        </div>
                                    </div>
                                    {amountError && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <FiAlertCircle className="mr-1" /> {amountError}
                                        </p>
                                    )}
                                    <div className="flex justify-between mt-1">
                                        <p className="text-xs text-gray-500">Min: Ksh {MIN_WITHDRAWAL.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">Max: Ksh {MAX_WITHDRAWAL.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Quick Amount Buttons */}
                                <div className="grid grid-cols-4 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setAmount('100')}
                                        className="py-2 px-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                                    >
                                        Ksh 100
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAmount('500')}
                                        className="py-2 px-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                                    >
                                        Ksh 500
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAmount('1000')}
                                        className="py-2 px-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                                    >
                                        Ksh 1,000
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAmount(user.withdrawable.toFixed(2))}
                                        className="py-2 px-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                                    >
                                        Max
                                    </button>
                                </div>

                                {/* Transaction Summary */}
                                {amount && !amountError && (
                                    <div className="border-t border-gray-200 pt-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Amount to withdraw:</span>
                                            <span className="text-sm font-medium">Ksh {parseFloat(amount).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Transaction fee (8%):</span>
                                            <span className="text-sm font-medium">Ksh {transactionFee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">Total deduction:</span>
                                            <span className="text-sm font-medium text-red-600">Ksh {totalDeduction.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-200">
                                            <span className="text-sm text-gray-600">You will receive:</span>
                                            <span className="text-sm font-medium text-green-600">Ksh {willReceive.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !!amountError || !amount || (useAlternativeNumber && !alternativeNumber)}
                                className={`mt-8 w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center ${isSubmitting || !!amountError || !amount || (useAlternativeNumber && !alternativeNumber)
                                    ? 'opacity-75 cursor-not-allowed'
                                    : 'hover:bg-blue-700'
                                    }`}
                            >
                                {isSubmitting ? (
                                    'Processing...'
                                ) : (
                                    'Request Withdrawal'
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Withdrawal Information */}
                <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Important Information</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2 mt-0.5">
                                <FiAlertCircle className="h-full w-full" />
                            </div>
                            <span>8% transaction fee applies to all withdrawals</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2 mt-0.5">
                                <FiAlertCircle className="h-full w-full" />
                            </div>
                            <span>Minimum withdrawal: Ksh {MIN_WITHDRAWAL.toLocaleString()}</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2 mt-0.5">
                                <FiAlertCircle className="h-full w-full" />
                            </div>
                            <span>Maximum per transaction: Ksh {MAX_WITHDRAWAL.toLocaleString()}</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2 mt-0.5">
                                <FiAlertCircle className="h-full w-full" />
                            </div>
                            <span>Only one withdrawal transaction allowed at a time</span>
                        </li>
                        <li className="flex items-start">
                            <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2 mt-0.5">
                                <FiAlertCircle className="h-full w-full" />
                            </div>
                            <span>Withdrawals processed within 24 hours on business days</span>
                        </li>
                    </ul>
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
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Withdrawal Request Submitted</h3>
                            <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Amount:</span>
                                    <span className="font-medium">Ksh {parseFloat(amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Fee (8%):</span>
                                    <span className="font-medium">Ksh {transactionFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total deduction:</span>
                                    <span className="font-medium text-red-600">Ksh {totalDeduction.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-200">
                                    <span className="text-gray-600">You'll receive:</span>
                                    <span className="font-medium text-green-600">Ksh {willReceive.toFixed(2)}</span>
                                </div>
                            </div>
                            <p className="text-gray-500 mb-6">
                                Your withdrawal request to {useAlternativeNumber ? alternativeNumber : user.phone} has been submitted successfully and is pending admin approval. You'll receive an SMS confirmation once processed.
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