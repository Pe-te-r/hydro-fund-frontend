import { useState } from 'react';
import { FiUser,  FiLock, FiEye, FiEyeOff, FiCheck, FiCopy } from 'react-icons/fi';
import QRCode from 'react-qr-code';

export default function SettingsPage() {
    // User data state (static for now)
    const [user, setUser] = useState({
        username: 'phantom8526',
        email: 'phantom8526@duck.com',
        phone: '0768543269',
        twoFactorEnabled: false,
    });

    // Form states
    const [editMode, setEditMode] = useState({
        username: false,
        email: false,
        phone: false,
        password: false,
    });
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email,
        phone: user.phone,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    // TOTP state
    const [totpSetup, setTotpSetup] = useState({
        secret: 'JBSWY3DPEHPK3PXP', // Example secret - in real app this would come from backend
        qrCodeUrl: 'otpauth://totp/Example:phantom8526?secret=JBSWY3DPEHPK3PXP&issuer=HydroFund',
        verificationCode: '',
        showSecret: false,
    });

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Toggle edit mode for a field
    const toggleEditMode = (field: keyof typeof editMode) => {
        setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
        // Reset form data when cancelling edit
        if (editMode[field]) {
            setFormData(prev => ({
                ...prev,
                [field]: user[field as keyof typeof user],
                ...(field === 'password' && {
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
            }));
        }
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent, field: keyof typeof editMode) => {
        e.preventDefault();
        // In a real app, this would call an API
        setUser(prev => ({ ...prev, [field]: formData[field] }));
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
    };

    // Toggle 2FA
    const toggleTwoFactor = () => {
        setUser(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
    };

    // Copy TOTP secret to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(totpSetup.secret);
        alert('Secret copied to clipboard!');
    };

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
                                    <form onSubmit={(e) => handleSubmit(e, 'username')} className="flex gap-2">
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
                                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            <FiCheck />
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
                                    <form onSubmit={(e) => handleSubmit(e, 'email')} className="flex gap-2">
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
                                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            <FiCheck />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-gray-900">{user.email}</p>
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
                                    <form onSubmit={(e) => handleSubmit(e, 'phone')} className="flex gap-2">
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
                                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            <FiCheck />
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-gray-900">{user.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Password Section */}
                        <div className="mb-10">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <FiLock className="mr-2" /> Password
                            </h2>
                            <div className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-gray-700">Change Password</label>
                                    <button
                                        onClick={() => toggleEditMode('password')}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        {editMode.password ? 'Cancel' : 'Change'}
                                    </button>
                                </div>

                                {editMode.password && (
                                    <form onSubmit={(e) => handleSubmit(e, 'password')} className="space-y-4">
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
                                            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Update Password
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
                                            {user.twoFactorEnabled
                                                ? 'Two-factor authentication is currently enabled'
                                                : 'Add an extra layer of security to your account'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={toggleTwoFactor}
                                        className={`px-4 py-2 rounded-md font-medium ${user.twoFactorEnabled
                                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                                            }`}
                                    >
                                        {user.twoFactorEnabled ? 'Disable' : 'Enable'}
                                    </button>
                                </div>

                                {!user.twoFactorEnabled && (
                                    <div className="mt-6">
                                        <h4 className="font-medium text-gray-800 mb-3">Setup Instructions</h4>
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
                                                    >
                                                        <FiCopy />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3">3. Verify the setup by entering a code from your app:</p>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={totpSetup.verificationCode}
                                                        onChange={(e) => setTotpSetup(prev => ({ ...prev, verificationCode: e.target.value }))}
                                                        placeholder="Enter 6-digit code"
                                                        className="flex-1 p-2 border border-gray-300 rounded-md"
                                                    />
                                                    <button
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                                    >
                                                        Verify
                                                    </button>
                                                </div>
                                            </div>
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