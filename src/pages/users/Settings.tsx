import { useState, useEffect } from 'react';
import { FiUser, FiLock, FiEye, FiEyeOff, FiCheck, FiCopy, FiMail, FiPhone, FiRefreshCw } from 'react-icons/fi';
import QRCode from 'react-qr-code';
import { useSettingsInfoQuery } from '../../slice/settings';
import { useAuth } from '../../context/AuthContext';

interface UserData {
    email: string;
    username: string;
    phone: string;
    twoFactorSecret: string | null;
    password: {
        lastChanged: string;
    };
}

interface FormData {
    username: string;
    email: string;
    phone: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface TotpSetup {
    secret: string;
    qrCodeUrl: string;
    verificationCode: string;
    showSecret: boolean;
    verified: boolean;
    verificationMethod: 'email' | 'phone';
    verificationPin: string[];
}

export default function SettingsPage() {
    const {user:info} = useAuth()
    console.log(info?.id)
    // Fetch user data from API
    let id;
    if (info?.id) {
        id = info?.id
    }
    console.log(id)
    const { data: apiResponse, isLoading, isError } = useSettingsInfoQuery(info?.id || '');
    const userData = apiResponse?.data;
    console.log(apiResponse)

    // User data state
    const [user, setUser] = useState<UserData>({
        email: '',
        username: '',
        phone: '',
        twoFactorSecret: null,
        password: { lastChanged: '' }
    });

    // Form states
    const [editMode, setEditMode] = useState({
        username: false,
        email: false,
        phone: false,
        password: false,
    });
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [hasChanges, setHasChanges] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    // TOTP state
    const [totpSetup, setTotpSetup] = useState<TotpSetup>({
        secret: '',
        qrCodeUrl: '',
        verificationCode: '',
        showSecret: false,
        verified: false,
        verificationMethod: 'phone',
        verificationPin: ['', '', '', '']
    });

    // Initialize with API data
    useEffect(() => {
        if (userData) {
            setUser(userData);
            setFormData({
                username: userData.username,
                email: userData.email,
                phone: userData.phone,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            if (userData.twoFactorSecret) {
                setTotpSetup(prev => ({
                    ...prev,
                    secret: userData.twoFactorSecret,
                    qrCodeUrl: `otpauth://totp/HydroFund:${userData.username}?secret=${userData.twoFactorSecret}&issuer=HydroFund`,
                    verified: true
                }));
            }
        }
    }, [userData]);

    // Check for changes in form data
    useEffect(() => {
        const changesExist =
            formData.username !== user.username ||
            formData.email !== user.email ||
            formData.phone !== user.phone;
        setHasChanges(changesExist);
    }, [formData, user]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle verification pin input
    const handlePinChange = (index: number, value: string) => {
        const newPin = [...totpSetup.verificationPin];
        newPin[index] = value;

        setTotpSetup(prev => ({
            ...prev,
            verificationPin: newPin
        }));

        // Auto submit when all fields are filled
        if (value && index === 3) {
            const pinCode = newPin.join('');
            console.log('Verification pin submitted:', pinCode);
            // In a real app, this would call an API
            setTotpSetup(prev => ({
                ...prev,
                verified: true
            }));
        }

        // Move focus to next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`verification-pin-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    // Toggle edit mode for a field
    const toggleEditMode = (field: keyof typeof editMode) => {
        setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
        // Reset form data when cancelling edit
        if (editMode[field]) {
            setFormData(prev => ({
                ...prev,
                [field]: user[field as keyof Omit<UserData, 'twoFactorSecret' | 'password'>],
                ...(field === 'password' && {
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            }));
        }
    };

    // Handle form submission for individual fields
    const handleFieldSubmit = async (e: React.FormEvent, field: keyof typeof editMode) => {
        e.preventDefault();
        setSaveLoading(true);

        try {
            // In a real app, this would call an API
            console.log(`Updating ${field}:`, formData[field as keyof FormData]);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setUser(prev => ({ ...prev, [field]: formData[field as keyof FormData] }));
            setEditMode(prev => ({ ...prev, [field]: false }));

            // For password, clear the fields after "submitting"
            if (field === 'password') {
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            }
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    // Handle bulk update submission
    const handleBulkSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveLoading(true);

        try {
            // Prepare the update data
            const updateData: Partial<FormData> = {};
            if (formData.username !== user.username) updateData.username = formData.username;
            if (formData.email !== user.email) updateData.email = formData.email;
            if (formData.phone !== user.phone) updateData.phone = formData.phone;

            // In a real app, this would call an API
            console.log('Bulk updating:', updateData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setUser(prev => ({
                ...prev,
                ...updateData
            }));
        } catch (error) {
            console.error('Bulk update failed:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    // Generate new TOTP secret
    const generateNewTotpSecret = () => {
        // In a real app, this would come from the backend
        const newSecret = generateRandomSecret();
        setTotpSetup({
            secret: newSecret,
            qrCodeUrl: `otpauth://totp/HydroFund:${user.username}?secret=${newSecret}&issuer=HydroFund`,
            verificationCode: '',
            showSecret: false,
            verified: false,
            verificationMethod: 'phone',
            verificationPin: ['', '', '', '']
        });
    };

    // Toggle 2FA
    const toggleTwoFactor = async () => {
        if (user.twoFactorSecret) {
            // Disable 2FA
            console.log('Disabling 2FA');
            setUser(prev => ({ ...prev, twoFactorSecret: null }));
        } else {
            // Enable 2FA - requires current TOTP code
            if (!totpSetup.verificationCode) {
                alert('Please enter your current TOTP code to enable 2FA');
                return;
            }

            console.log('Enabling 2FA with code:', totpSetup.verificationCode);
            // In a real app, this would call an API
            await new Promise(resolve => setTimeout(resolve, 500));

            setUser(prev => ({
                ...prev,
                twoFactorSecret: totpSetup.secret
            }));
        }
    };

    // Copy TOTP secret to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(totpSetup.secret);
        // Show feedback
        const copyBtn = document.getElementById('copy-secret-btn');
        if (copyBtn) {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                if (copyBtn) copyBtn.textContent = 'Copy';
            }, 2000);
        }
    };

    // Helper function to generate random secret (for demo)
    const generateRandomSecret = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let result = '';
        for (let i = 0; i < 16; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (isError) return <div className="min-h-screen flex items-center justify-center text-red-600">Error loading settings</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="p-6 sm:p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

                        {/* Profile Information Section */}
                        <div className="mb-10">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FiUser className="mr-2" /> Profile Information
                            </h2>

                            {/* Username Field */}
                            <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700">Username</label>
                                    <button
                                        onClick={() => toggleEditMode('username')}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        {editMode.username ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                                {editMode.username ? (
                                    <form onSubmit={(e) => handleFieldSubmit(e, 'username')} className="flex gap-2">
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="flex-1 p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                            disabled={saveLoading}
                                        >
                                            {saveLoading ? 'Saving...' : <FiCheck />}
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-gray-900">{user.username}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <button
                                        onClick={() => toggleEditMode('email')}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        {editMode.email ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                                {editMode.email ? (
                                    <form onSubmit={(e) => handleFieldSubmit(e, 'email')} className="flex gap-2">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="flex-1 p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                            disabled={saveLoading}
                                        >
                                            {saveLoading ? 'Saving...' : <FiCheck />}
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-gray-900 flex items-center">
                                        <FiMail className="mr-2" /> {user.email}
                                    </p>
                                )}
                            </div>

                            {/* Phone Field */}
                            <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                    <button
                                        onClick={() => toggleEditMode('phone')}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        {editMode.phone ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                                {editMode.phone ? (
                                    <form onSubmit={(e) => handleFieldSubmit(e, 'phone')} className="flex gap-2">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="flex-1 p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                                            disabled={saveLoading}
                                        >
                                            {saveLoading ? 'Saving...' : <FiCheck />}
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-gray-900 flex items-center">
                                        <FiPhone className="mr-2" /> {user.phone}
                                    </p>
                                )}
                            </div>

                            {/* Bulk save button for multiple changes */}
                            {hasChanges && (
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleBulkSubmit}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        disabled={saveLoading}
                                    >
                                        {saveLoading ? 'Saving Changes...' : 'Save All Changes'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Password Section */}
                        <div className="mb-10">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FiLock className="mr-2" /> Password
                            </h2>
                            <div className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Password</label>
                                        <p className="text-xs text-gray-500">
                                            Last changed: {new Date(user.password.lastChanged).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => toggleEditMode('password')}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        {editMode.password ? 'Cancel' : 'Change'}
                                    </button>
                                </div>

                                {editMode.password && (
                                    <form onSubmit={(e) => handleFieldSubmit(e, 'password')} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword.current ? "text" : "password"}
                                                    name="currentPassword"
                                                    value={formData.currentPassword}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md pr-10"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                                                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword.current ? <FiEyeOff /> : <FiEye />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword.new ? "text" : "password"}
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md pr-10"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword.new ? <FiEyeOff /> : <FiEye />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword.confirm ? "text" : "password"}
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border border-gray-300 rounded-md pr-10"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex justify-center items-center"
                                            disabled={saveLoading}
                                        >
                                            {saveLoading ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Two-Factor Authentication Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Two-Factor Authentication</h2>
                            <div className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="font-medium text-gray-800">TOTP Authenticator</h3>
                                        <p className="text-sm text-gray-600">
                                            {user.twoFactorSecret
                                                ? 'Two-factor authentication is currently enabled'
                                                : 'Add an extra layer of security to your account'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={toggleTwoFactor}
                                        className={`px-4 py-2 rounded-md font-medium ${user.twoFactorSecret
                                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                                            }`}
                                    >
                                        {user.twoFactorSecret ? 'Disable' : 'Enable'}
                                    </button>
                                </div>

                                {user.twoFactorSecret && (
                                    <div className="mt-4">
                                        <div className="flex items-center gap-2 text-green-600 mb-2">
                                            <FiCheck className="text-lg" />
                                            <span>2FA is active and verified</span>
                                        </div>
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
                                            <p>If you lose access to your authenticator app, you'll need to contact support to regain access to your account.</p>
                                        </div>
                                    </div>
                                )}

                                {(!user.twoFactorSecret || !totpSetup.verified) && (
                                    <div className="mt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-medium text-gray-800">Setup Instructions</h4>
                                            {user.twoFactorSecret && (
                                                <button
                                                    onClick={generateNewTotpSecret}
                                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                                >
                                                    <FiRefreshCw className="mr-1" /> Renew Secret
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-3">1. Scan this QR code with your authenticator app:</p>
                                                <div className="p-4 bg-white border border-gray-200 rounded-lg inline-block">
                                                    <QRCode
                                                        value={totpSetup.qrCodeUrl}
                                                        size={128}
                                                        level="M"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 mb-3">2. Or enter this secret key manually:</p>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <code className="p-2 bg-gray-100 rounded-md font-mono">
                                                        {totpSetup.showSecret ? totpSetup.secret : '••••••••••••••••'}
                                                    </code>
                                                    <button
                                                        onClick={() => setTotpSetup(prev => ({ ...prev, showSecret: !prev.showSecret }))}
                                                        className="text-sm text-blue-600"
                                                    >
                                                        {totpSetup.showSecret ? 'Hide' : 'Show'}
                                                    </button>
                                                    <button
                                                        onClick={copyToClipboard}
                                                        className="text-gray-500 hover:text-gray-700"
                                                        title="Copy to clipboard"
                                                        id="copy-secret-btn"
                                                    >
                                                        <FiCopy /> Copy
                                                    </button>
                                                </div>

                                                {!totpSetup.verified && (
                                                    <>
                                                        <p className="text-sm text-gray-600 mb-3">3. Verify the setup by entering a code from your app:</p>
                                                        <div className="flex gap-2 mb-4">
                                                            <input
                                                                type="text"
                                                                value={totpSetup.verificationCode}
                                                                onChange={(e) => setTotpSetup(prev => ({ ...prev, verificationCode: e.target.value }))}
                                                                placeholder="Enter 6-digit code"
                                                                className="flex-1 p-2 border border-gray-300 rounded-md"
                                                            />
                                                            <button
                                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                                onClick={() => {
                                                                    console.log('TOTP code verified:', totpSetup.verificationCode);
                                                                    setTotpSetup(prev => ({ ...prev, verified: true }));
                                                                }}
                                                            >
                                                                Verify
                                                            </button>
                                                        </div>

                                                        <div className="mb-4">
                                                            <p className="text-sm text-gray-600 mb-2">Or verify via:</p>
                                                            <div className="flex gap-3">
                                                                <button
                                                                    className={`px-3 py-1 text-sm rounded-md flex items-center ${totpSetup.verificationMethod === 'phone' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                                                                    onClick={() => setTotpSetup(prev => ({ ...prev, verificationMethod: 'phone' }))}
                                                                >
                                                                    <FiPhone className="mr-1" /> SMS
                                                                </button>
                                                                <button
                                                                    className={`px-3 py-1 text-sm rounded-md flex items-center ${totpSetup.verificationMethod === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                                                                    onClick={() => setTotpSetup(prev => ({ ...prev, verificationMethod: 'email' }))}
                                                                >
                                                                    <FiMail className="mr-1" /> Email
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <p className="text-sm text-gray-600 mb-2">Enter the 4-digit verification code sent to your {totpSetup.verificationMethod}:</p>
                                                            <div className="flex gap-2 mb-3">
                                                                {[0, 1, 2, 3].map((index) => (
                                                                    <input
                                                                        key={index}
                                                                        id={`verification-pin-${index}`}
                                                                        type="text"
                                                                        maxLength={1}
                                                                        value={totpSetup.verificationPin[index]}
                                                                        onChange={(e) => handlePinChange(index, e.target.value)}
                                                                        className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg"
                                                                        pattern="[0-9]"
                                                                        inputMode="numeric"
                                                                    />
                                                                ))}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="text-sm text-blue-600 hover:text-blue-800"
                                                            >
                                                                Resend code
                                                            </button>
                                                        </div>
                                                    </>
                                                )}

                                                {totpSetup.verified && !user.twoFactorSecret && (
                                                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                                                        <div className="flex items-center gap-2 text-green-700">
                                                            <FiCheck className="text-lg" />
                                                            <span>Your authenticator is verified</span>
                                                        </div>
                                                        <p className="text-sm text-green-700 mt-1">You can now enable 2FA for your account.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {user.twoFactorSecret && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-600 mb-2">Enter your current TOTP code to make changes:</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={totpSetup.verificationCode}
                                                onChange={(e) => setTotpSetup(prev => ({ ...prev, verificationCode: e.target.value }))}
                                                placeholder="Enter 6-digit code"
                                                className="flex-1 p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}