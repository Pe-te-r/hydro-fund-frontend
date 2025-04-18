import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";
import { useSendEmailQuery, useVerifyCodeMutation } from "../slice/sendEmail";

interface CodeVerificationProps {
    onVerify: (code: string) => void;
    onCancel: () => void;
    verifyType: 'profile' | 'password' | '2fa';
}

export const CodeVerification = ({ onVerify, onCancel, verifyType }: CodeVerificationProps) => {
    const { user } = useAuth();
    const [code, setCode] = useState<string[]>(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(4).fill(null));

    // Using the email API hook
    const { refetch: sendEmail } = useSendEmailQuery(user?.id || '', {
        skip: !user?.id // Skip if no user ID
    });

    // Send initial email on component mount
    useEffect(() => {
        handleSendEmail();
    }, []);

    // Handle resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleSendEmail = async () => {
        if (resendCooldown > 0) return;

        setIsLoading(true);
        try {
            const result = await sendEmail();
            if (result.data?.data) {
                toast.success(result.data.message);
                setResendCooldown(60); // 1 minute cooldown
            } else {
                toast.error('Failed to send verification code');
            }
            console.log(result.data?.message)

        } catch (error: unknown) {
            console.log(error)
            toast.error('Error sending verification code');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d+$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus to next input if value entered, or previous if deleted
        if (value) {
            if (index < 3) {
                inputRefs.current[index + 1]?.focus();
            }
        } else {
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace on empty input to move to previous field
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Allow arrow key navigation
        if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 3) {
            e.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').slice(0, 4);
        if (/^\d+$/.test(pastedData)) {
            const newCode = [...code];
            for (let i = 0; i < pastedData.length; i++) {
                newCode[i] = pastedData[i];
                if (i < 3) {
                    inputRefs.current[i + 1]?.focus();
                }
            }
            setCode(newCode);
        }
    };
    const [verifyCode, ] = useVerifyCodeMutation();

    const handleSubmit = async () => {
        const fullCode = code.join('');
        if (fullCode.length === 4) {
            setIsLoading(true);

            try {
                const response = await verifyCode({
                    id: user?.id || '',        // make sure you pass the correct user ID here
                    code: fullCode,
                }).unwrap(); // unwrap to throw if error
                console.log(response)

                // Show toast based on response
                if (response.data) {
                    toast.success(response.message);
                    onVerify(fullCode); // call your success callback
                } else {
                    toast.error(response.message);
                }
            } catch (error: unknown) {
                console.log(error)
                const errorInfo = error as { data: { message: string } }
                toast.error(errorInfo.data.message || 'Something wen wrong');
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.error('Please enter a valid 4-digit code');
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                <h3 className="text-lg font-medium mb-4">
                    {verifyType === 'profile' ? 'Profile Verification' :
                        verifyType === 'password' ? 'Password Change Verification' :
                            'Two-Factor Authentication'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Please enter the 4-digit verification code sent to your email
                </p>

                <div className="flex justify-center space-x-3 mb-6">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            className="w-14 h-14 border-2 border-gray-300 rounded-lg text-center text-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            disabled={isLoading}
                        />
                    ))}
                </div>

                <div className="flex flex-col items-center mb-4">
                    <button
                        onClick={handleSendEmail}
                        disabled={resendCooldown > 0 || isLoading}
                        className={`text-sm ${resendCooldown > 0 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'} mb-2`}
                    >
                        {resendCooldown > 0 ?
                            `Resend code in ${resendCooldown}s` :
                            "Didn't receive code? Request a new one"}
                    </button>
                    {isLoading && (
                        <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={code.join('').length !== 4 || isLoading}
                        className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                </div>
            </div>
        </div>
    );
};