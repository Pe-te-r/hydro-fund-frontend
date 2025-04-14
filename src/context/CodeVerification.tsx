import { useRef, useState } from "react";
import { toast } from "react-toastify";

interface CodeVerificationProps {
    onVerify: (code: string) => void;
    onCancel: () => void;
    verifyType: 'profile' | 'password' | '2fa';
}

export const CodeVerification = ({ onVerify, onCancel, verifyType }: CodeVerificationProps) => {
    const [code, setCode] = useState<string[]>(['', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(4).fill(null));

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d+$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus to next input
        if (value && index < 3) {
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
            }
            setCode(newCode);
        }
    };

    const handleSubmit = () => {
        const fullCode = code.join('');
        if (fullCode.length === 4) {
            if (fullCode === '1234') {
                onVerify(fullCode);
                toast.success('Code verified successfully');
            } else {
                toast.error('Invalid verification code');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-medium mb-4">
                    {verifyType === 'profile' ? 'Profile Verification' :
                        verifyType === 'password' ? 'Password Change Verification' : 'Two-Factor Authentication'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">Please enter the 4-digit verification code</p>

                <div className="flex justify-center space-x-2 mb-6">
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
                            onPaste={handlePaste}
                            className="w-12 h-12 border border-gray-300 rounded text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ))}
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Verify
                    </button>
                </div>
            </div>
        </div>
    );
};
