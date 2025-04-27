import { useState, useRef } from 'react';
import {  useNavigate } from 'react-router-dom';
import { FiMail, FiPhone, FiUser, FiLock, FiCopy } from 'react-icons/fi';
import { useInitiatePasswordResetMutation, useChangePasswordMutation } from '../slice/forget';
import { useVerifyOtpMutation, useVerifyCodeMutation } from '../slice/code';
import { changePasswordRequest, ErrorResponse } from '../types/type';

type resultType = {
    email?: string;
    phone?: string;
    username?: string;
};
type identify={
    code?: string;
    otp?: string;
    
}

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'initiate' | 'verify' | 'reset'>('initiate');
    const [method, setMethod] = useState<'email' | 'phone' | 'username'>('email');
    const [identifierValues, setIdentifierValues] = useState({
        email: '',
        phone: '',
        username: ''
    });
    const [identifier, setIdentifier] = useState('');
    const [verificationType, setVerificationType] = useState<'otp' | 'code' | null>(null);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [code, setCode] = useState<string[]>(Array(4).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const otpRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));
    const codeRefs = useRef<(HTMLInputElement | null)[]>(Array(4).fill(null));

    const [initiateReset, { isLoading: initiating }] = useInitiatePasswordResetMutation();
    const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();
    const [verifyOtp, { isLoading: verifyingOtp }] = useVerifyOtpMutation();
    const [verifyCode, { isLoading: verifyingCode }] = useVerifyCodeMutation();


    const handleMethodChange = (newMethod: 'email' | 'phone' | 'username') => {
        // Save current input value before switching
        setIdentifierValues(prev => ({
            ...prev,
            [method]: identifier
        }));

        // Switch to new method
        setMethod(newMethod);

        // Set identifier to the stored value for the new method
        setIdentifier(identifierValues[newMethod]);
    };


    const handleInitiateReset = async () => {
        setError('');
        try {
            const request: resultType = {};
            if (method === 'email') request.email = identifier;
            if (method === 'phone') request.phone = identifier;
            if (method === 'username') request.username = identifier;

            const response = await initiateReset(request).unwrap();

            if (response.data?.code && response.data?.otp) {
                // Both methods available - let user choose
                setVerificationType(null);
            } else if (response.data?.code) {
                setVerificationType('code');
            } else if (response.data?.otp) {
                setVerificationType('otp');
            }

            setStep('verify');
        } catch (err: unknown) {
            const apiError = err as { status: number; data: ErrorResponse };
            setError(apiError?.data.message || 'Failed to initiate password reset');
        }
    };

    const handleVerify = async () => {
        setError('');
        try {
            const request:identify = { [method]: identifier };

            if (verificationType === 'otp') {
                request.otp = otp.join('');
                await verifyOtp(request).unwrap();
            } else {
                request.code = code.join('');
                await verifyCode(request).unwrap();
            }

            setStep('reset');
        } catch (err: unknown) {
            const apiError = err as { status: number; data: ErrorResponse };
            setError(apiError?.data.message || 'Verification failed');
        }
    };

    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setError('');
        try {
            const request:changePasswordRequest = { [method]: identifier, password: newPassword };
            await changePassword(request).unwrap();

            setSuccess('Password changed successfully. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: unknown) {
            const apiError = err as { status: number; data: ErrorResponse };
            setError(apiError.data?.message || 'Failed to change password');
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus to next input
        if (value && index < 5 && otpRefs.current[index + 1]) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleCodeChange = (index: number, value: string) => {
        if (!/^[0-9]*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto focus to next input
        if (value && index < 3 && codeRefs.current[index + 1]) {
            codeRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent, length: number) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text/plain').slice(0, length);

        if (/^[0-9]+$/.test(pasteData)) {
            if (length === 6) {
                const newOtp = [...otp];
                pasteData.split('').forEach((char, i) => {
                    if (i < 6) newOtp[i] = char;
                });
                setOtp(newOtp);
            } else {
                const newCode = [...code];
                pasteData.split('').forEach((char, i) => {
                    if (i < 4) newCode[i] = char;
                });
                setCode(newCode);
            }
        }
    };

    const copyToClipboard = (value: string) => {
        navigator.clipboard.writeText(value);
        // You might want to show a toast notification here
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Forgot Password
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    { step === 'initiate' && (
                            <div className="space-y-6">
                                <div>
                                    <div className="flex rounded-md shadow-sm">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                            {method === 'email' && <FiMail className="h-5 w-5" />}
                                            {method === 'phone' && <FiPhone className="h-5 w-5" />}
                                            {method === 'username' && <FiUser className="h-5 w-5" />}
                                        </span>
                                        <input
                                            type={method === 'phone' ? 'tel' : method === 'email' ? 'email' : 'text'}
                                            value={identifier}
                                            onChange={(e) => setIdentifier(e.target.value)}
                                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                                            placeholder={
                                                method === 'email' ? 'email@example.com' :
                                                    method === 'phone' ? '+1234567890' :
                                                        'username'
                                            }
                                        />
                                    </div>
                                </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleMethodChange('email')}
                                    className={`px-3 py-1 rounded text-sm ${method === 'email' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    Email
                                </button>
                                <button
                                    onClick={() => handleMethodChange('phone')}
                                    className={`px-3 py-1 rounded text-sm ${method === 'phone' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    Phone
                                </button>
                                <button
                                    onClick={() => handleMethodChange('username')}
                                    className={`px-3 py-1 rounded text-sm ${method === 'username' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    Username
                                </button>
                            </div>

                            <div>
                                <button
                                    onClick={handleInitiateReset}
                                    disabled={!identifier || initiating}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {initiating ? 'Sending...' : 'Reset Password'}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'verify' && (
                        <div className="space-y-6">
                            <p className="text-sm text-gray-600">
                                {verificationType === 'code' ?"We've sent a 4-digit code.Please enter it below.":'Use your authenticator app '}
                            </p>

                            {verificationType === null && (
                                <div className="flex space-x-2 justify-center">
                                    <button
                                        onClick={() => setVerificationType('code')}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Use 4-digit Code
                                    </button>
                                    <button
                                        onClick={() => setVerificationType('otp')}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    >
                                        Use 6-digit OTP
                                    </button>
                                </div>
                            )}

                            {verificationType === 'otp' && (
                                <div>
                                    <div className="flex justify-between space-x-2 mb-4">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onPaste={(e) => handlePaste(e, 6)}
                                                ref={(el) => { otpRefs.current[index] = el }}
                                                className="w-12 h-12 text-center text-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(otp.join(''))}
                                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                                    >
                                        <FiCopy className="mr-1" /> Copy OTP
                                    </button>
                                </div>
                            )}

                            {verificationType === 'code' && (
                                <div>
                                    <div className="flex justify-between space-x-2 mb-4">
                                        {code.map((digit, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                                onPaste={(e) => handlePaste(e, 4)}
                                                ref={(el) => { codeRefs.current[index] = el }}
                                                className="w-12 h-12 text-center text-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(code.join(''))}
                                        className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                                    >
                                        <FiCopy className="mr-1" /> Copy Code
                                    </button>
                                </div>
                            )}

                            {verificationType && (
                                <div>
                                    <button
                                        onClick={handleVerify}
                                        disabled={
                                            (verificationType === 'otp' && otp.some(d => !d)) ||
                                            (verificationType === 'code' && code.some(d => !d)) ||
                                            (verificationType === 'otp' ? verifyingOtp : verifyingCode)
                                        }
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {verificationType === 'otp'
                                            ? (verifyingOtp ? 'Verifying...' : 'Verify OTP')
                                            : (verifyingCode ? 'Verifying...' : 'Verify Code')}
                                    </button>
                                </div>
                            )}

                            <div className="text-center">
                                <button
                                    onClick={() => setStep('initiate')}
                                    className="text-sm text-indigo-600 hover:text-indigo-500"
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'reset' && (
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Minimum 8 characters"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={handlePasswordReset}
                                    disabled={!newPassword || !confirmPassword || changingPassword}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {changingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={() => setStep('verify')}
                                    className="text-sm text-indigo-600 hover:text-indigo-500"
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;