import { useState } from 'react';
import { FiEdit, FiX, FiCheck, FiEye, FiEyeOff, FiCopy } from 'react-icons/fi';
import { toast } from 'react-toastify';
import QRCode from 'react-qr-code';
import { UserSettings } from '../slice/settings';
import { CodeVerification } from '../context/CodeVerification';

interface SecuritySettingsProps {
    userData: UserSettings;
    onPasswordUpdate: (data: { old: string; new: string }) => Promise<void>;
    on2FAUpdate: (data: { code?: string; enabled: boolean }) => Promise<void>;
}

const SecuritySettings = ({ userData, onPasswordUpdate, on2FAUpdate }: SecuritySettingsProps) => {
    // Password state
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        old: '',
        new: '',
        confirm: ''
    });
    const [showPasswordFields, setShowPasswordFields] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [showPasswordCodeVerification, setShowPasswordCodeVerification] = useState(false);
    const [passwordCodeVerified, setPasswordCodeVerified] = useState(false);

    // 2FA state
    const [show2FASetup, setShow2FASetup] = useState(false);
    const [twoFACode, setTwoFACode] = useState('');
    const [showDisable2FA, setShowDisable2FA] = useState(false);
    const [disable2FACode, setDisable2FACode] = useState('');

    const canEditPassword = (): boolean => {
        if (!userData.password?.lastChanged) return true;
        const lastChanged = new Date(userData.password.lastChanged);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return lastChanged < sevenDaysAgo;
    };

    // Password handlers
    const handlePasswordEdit = () => setIsEditingPassword(true);
    const handlePasswordCancel = () => {
        setIsEditingPassword(false);
        setPasswordCodeVerified(false);
        setPasswordData({ old: '', new: '', confirm: '' });
    };

    const handlePasswordVerify = () => {
        if (passwordData.new !== passwordData.confirm) {
            toast.error('New passwords do not match');
            return;
        }
        if (passwordData.new.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        setShowPasswordCodeVerification(true);
    };

    const handlePasswordUpdate = async () => {
        try {
            await onPasswordUpdate({ old: passwordData.old, new: passwordData.new });
            setIsEditingPassword(false);
            setPasswordCodeVerified(false);
            setPasswordData({ old: '', new: '', confirm: '' });
        } catch (error) {
            console.log(error)
            toast.error('Failed to update password');
        }
    };

    const handlePasswordCodeVerification = (code: string) => {
        console.log('Password verification code:', code);
        setPasswordCodeVerified(true);
        setShowPasswordCodeVerification(false);
    };

    // 2FA handlers
    const handle2FAToggle = () => {
        if (userData.twoFactorEnabled) {
            setShowDisable2FA(true);
        } else {
            setShow2FASetup(true);
        }
    };

    const handleEnable2FA = async () => {
        try {
            await on2FAUpdate({ code: twoFACode, enabled: true });
            setShow2FASetup(false);
            setTwoFACode('');
        } catch (error) {
            console.log(error)
            toast.error('Failed to enable 2FA');
        }
    };

    const handleDisable2FA = async () => {
        try {
            await on2FAUpdate({ code: disable2FACode, enabled: false });
            setShowDisable2FA(false);
            setDisable2FACode('');
        } catch (error) {
            console.log(error)
            toast.error('Failed to disable 2FA');
        }
    };

    const twoFactorAuthURI = `otpauth://totp/HydroFund:${userData.email}?secret=${userData.twoFactorSecret}&issuer=HydroFund`;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Security</h2>

            {/* Password Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    {!isEditingPassword && canEditPassword() && (
                        <button
                            onClick={handlePasswordEdit}
                            className="flex items-center cursor-pointer text-blue-600 hover:text-blue-800"
                        >
                            <FiEdit className="mr-1" /> Change Password
                        </button>
                    )}
                    {isEditingPassword && (
                        <button
                            onClick={handlePasswordCancel}
                            className="flex items-center cursor-pointer text-gray-600 hover:text-gray-800"
                        >
                            <FiX className="mr-1" /> Cancel
                        </button>
                    )}
                </div>

                {isEditingPassword ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Old Password</label>
                            <div className="relative mt-1">
                                <input
                                    type={showPasswordFields.old ? "text" : "password"}
                                    value={passwordData.old}
                                    onChange={(e) => setPasswordData({ ...passwordData, old: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPasswordFields({ ...showPasswordFields, old: !showPasswordFields.old })}
                                >
                                    {showPasswordFields.old ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <div className="relative mt-1">
                                <input
                                    type={showPasswordFields.new ? "text" : "password"}
                                    value={passwordData.new}
                                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPasswordFields({ ...showPasswordFields, new: !showPasswordFields.new })}
                                >
                                    {showPasswordFields.new ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <div className="relative mt-1">
                                <input
                                    type={showPasswordFields.confirm ? "text" : "password"}
                                    value={passwordData.confirm}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() => setShowPasswordFields({ ...showPasswordFields, confirm: !showPasswordFields.confirm })}
                                >
                                    {showPasswordFields.confirm ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {passwordData.new && passwordData.confirm && passwordData.new !== passwordData.confirm && (
                                <p className="mt-1 text-xs text-red-500">Passwords don't match</p>
                            )}
                        </div>

                        <div className="pt-2">
                            {passwordCodeVerified ? (
                                <button
                                    onClick={handlePasswordUpdate}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                                >
                                    <FiCheck className="mr-1" /> Update Password
                                </button>
                            ) : (
                                <button
                                    onClick={handlePasswordVerify}
                                    className="flex cursor-pointer items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <FiCheck className="mr-1" /> Verify Password Change
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-gray-600">
                            Last changed: {new Date(userData.password.lastChanged).toLocaleString(undefined, {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                        {!canEditPassword() && (
                            <p className="text-sm text-yellow-600 mt-1">
                                You can only change your password every 7 days. Next change available on {
                                    new Date(
                                        new Date(userData.password.lastChanged).getTime() + 7 * 24 * 60 * 60 * 1000
                                    ).toLocaleString(undefined, {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })
                                }
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Two-Factor Authentication Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <button
                        onClick={handle2FAToggle}
                        className={`px-4 py-2 rounded-md cursor-pointer ${userData.twoFactorEnabled
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            }`}
                    >
                        {userData.twoFactorEnabled ? 'Disable' : 'Enable'}
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                    {userData.twoFactorEnabled
                        ? 'Two-factor authentication is currently enabled.'
                        : 'Two-factor authentication adds an extra layer of security to your account.'}
                </p>

                {/* 2FA Setup (when enabling) */}
                {show2FASetup && !userData.twoFactorEnabled && (
                    <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium mb-2">Set Up Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600 mb-4">
                            Scan the QR code below with your authenticator app or enter the code manually.
                        </p>

                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="bg-white p-2 rounded">
                                <QRCode value={twoFactorAuthURI} size={128} />
                            </div>

                            <div>
                                <p className="text-sm font-medium mb-2">Manual Entry</p>
                                <div className="flex items-center">
                                    <code className="bg-gray-200 px-3 py-1 rounded-md mr-2">
                                        {userData.twoFactorSecret}
                                    </code>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(userData.twoFactorSecret || '');
                                            toast.success('Copied to clipboard');
                                        }}
                                        className="text-blue-600 hover:text-blue-800 flex items-center cursor-pointer"
                                    >
                                        <FiCopy className="mr-1" /> Copy
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Enter 6-digit verification code
                                    </label>
                                    <input
                                        type="text"
                                        value={twoFACode}
                                        onChange={(e) => setTwoFACode(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                        placeholder="123456"
                                        maxLength={6}
                                    />
                                </div>

                                <button
                                    onClick={handleEnable2FA}
                                    className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                                >
                                    <FiCheck className="mr-1" /> Verify and Enable
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2FA Disable (when disabling) */}
                {showDisable2FA && userData.twoFactorEnabled && (
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-4">
                        <h4 className="font-medium text-lg mb-3 text-gray-800">Disable Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600 mb-4">
                            To disable two-factor authentication, please enter a verification code from your authenticator app.
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter 6-digit verification code
                            </label>
                            <input
                                type="text"
                                value={disable2FACode}
                                onChange={(e) => setDisable2FACode(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                placeholder="123456"
                                maxLength={6}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDisable2FA(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDisable2FA}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
                            >
                                <FiCheck size={18} /> Disable 2FA
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showPasswordCodeVerification && (
                <CodeVerification
                    onVerify={handlePasswordCodeVerification}
                    onCancel={() => setShowPasswordCodeVerification(false)}
                    verifyType="password"
                />
            )}
        </div>
    );
};

export default SecuritySettings;