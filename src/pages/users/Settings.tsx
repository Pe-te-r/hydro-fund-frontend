import { useState, useEffect } from 'react';
import { FiEdit, FiSave, FiEye, FiEyeOff, FiCopy, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import QRCode from 'react-qr-code';
import { UserSettings, useSettingsInfoQuery } from '../../slice/settings';
import { useAuth } from '../../context/AuthContext';
import { CodeVerification } from '../../context/CodeVerification';

interface ProfileData {
    email: string;
    username: string;
    phone: string;
}

interface PasswordData {
    old: string;
    new: string;
    confirm: string;
}

interface ShowPasswordFields {
    old: boolean;
    new: boolean;
    confirm: boolean;
}

const SettingsPage = () => {
    const { user } = useAuth();
    const { data: settingsData, isLoading, isError, refetch } = useSettingsInfoQuery(user?.id || '');

    const [userData, setUserData] = useState<UserSettings | undefined>(settingsData?.data);

    // Profile state
    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        email: '',
        username: '',
        phone: ''
    });
    const [showProfileCodeVerification, setShowProfileCodeVerification] = useState<boolean>(false);
    const [profileCodeVerified, setProfileCodeVerified] = useState<boolean>(false);

    // Password state
    const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);
    const [passwordData, setPasswordData] = useState<PasswordData>({
        old: '',
        new: '',
        confirm: ''
    });
    const [showPasswordFields, setShowPasswordFields] = useState<ShowPasswordFields>({
        old: false,
        new: false,
        confirm: false
    });
    const [showPasswordCodeVerification, setShowPasswordCodeVerification] = useState<boolean>(false);
    const [passwordCodeVerified, setPasswordCodeVerified] = useState<boolean>(false);

    // 2FA state
    const [show2FACodeVerification, setShow2FACodeVerification] = useState<boolean>(false);
    const [twoFACodeVerified, setTwoFACodeVerified] = useState<boolean>(false);
    const [show2FASetup, setShow2FASetup] = useState<boolean>(false);
    const [faValue, setFaValue] = useState<string>('');

    // Effect to sync userData with settingsData
    useEffect(() => {
        if (settingsData?.data) {
            setUserData(settingsData.data);
        }
    }, [settingsData]);

    // Effect to update profileData when userData changes
    useEffect(() => {
        if (userData) {
            setProfileData({
                email: userData.email,
                username: userData.username,
                phone: userData.phone
            });
        }
    }, [userData]);

    // Effect to handle profile updates
    useEffect(() => {
        if (profileCodeVerified) {
            handleProfileUpdate();
        }
    }, [profileCodeVerified]);

    // Effect to handle 2FA updates
    useEffect(() => {
        if (twoFACodeVerified) {
            handle2FAUpdate();
        }
    }, [twoFACodeVerified]);

    if (isLoading) return <div>Loading settings...</div>;
    if (isError) return <div>Error loading settings</div>;
    if (!userData) return <div>No user data found</div>;

    const canEditPassword = (): boolean => {
        if (!userData.password?.lastChanged) return true;
        const lastChanged = new Date(userData.password.lastChanged);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return lastChanged < threeDaysAgo;
    };

    const handleProfileEdit = (): void => {
        setIsEditingProfile(true);
    };

    const handleProfileCancel = (): void => {
        setIsEditingProfile(false);
        setProfileCodeVerified(false);
        setProfileData({
            email: userData.email,
            username: userData.username,
            phone: userData.phone
        });
    };

    const handleProfileVerify = (): void => {
        setShowProfileCodeVerification(true);
    };

    const handleProfileUpdate = async (): Promise<void> => {
        try {
            // In a real app, you would call your API here to update the profile
            console.log('Profile update data:', profileData);

            // Refetch to get the latest data from the database
            const { data } = await refetch();

            if (data?.data) {
                console.log('Latest profile data from DB:', {
                    email: data.data.email,
                    username: data.data.username,
                    phone: data.data.phone
                });
                setUserData(data?.data)
            }

            toast.success('Profile changes verified (check console for latest data)');
            setIsEditingProfile(false);
            setProfileCodeVerified(false);
        } catch (error) {
            console.log(error)
            toast.error('Failed to verify profile changes');
        }
    };

    const handlePasswordEdit = (): void => {
        setIsEditingPassword(true);
    };

    const handlePasswordCancel = (): void => {
        setIsEditingPassword(false);
        setPasswordCodeVerified(false);
        setPasswordData({ old: '', new: '', confirm: '' });
    };

    const handlePasswordVerify = (): void => {
        if (passwordData.new !== passwordData.confirm) {
            toast.error('New passwords do not match');
            return;
        }
        if (passwordData.new.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setShowPasswordCodeVerification(true);
    };

    const handlePasswordUpdate = (): void => {
        console.log('Password update data:', {
            old: passwordData.old,
            new: passwordData.new
        });
        toast.success('Password changes verified (check console)');
        setIsEditingPassword(false);
        setPasswordCodeVerified(false);
        setPasswordData({ old: '', new: '', confirm: '' });
    };

    const handle2FAVerify = (): void => {
        setShow2FACodeVerification(true);
    };

    const handle2FAToggle = (): void => {
        if (userData.twoFactorEnabled) {
            console.log('Disabling 2FA');
            toast.success('Two-factor authentication disabled');
        } else {
            setShow2FASetup(true);
        }
    };

    const handle2FAUpdate = async (): Promise<void> => {
        try {
            console.log('2FA verification code:', faValue);

            // In a real app, you would call your API here to verify 2FA
            // For now, we'll just refetch to simulate getting updated data
            const { data } = await refetch();

            if (data?.data) {
                console.log('Latest 2FA status from DB:', {
                    twoFactorEnabled: data.data.twoFactorEnabled,
                    twoFactorSecret: data.data.twoFactorSecret
                });
            }

            toast.success('2FA verified (check console for latest data)');
            setShow2FASetup(false);
            setFaValue('');
            setTwoFACodeVerified(false);
        } catch (error) {
            console.log(error)
            toast.error('Failed to verify 2FA code');
        }
    };

    const handleCodeVerificationComplete = (type: 'profile' | 'password' | '2fa', code: string): void => {
        console.log(`Verification code for ${type}:`, code);
        switch (type) {
            case 'profile':
                setProfileCodeVerified(true);
                setShowProfileCodeVerification(false);
                break;
            case 'password':
                setPasswordCodeVerified(true);
                setShowPasswordCodeVerification(false);
                break;
            case '2fa':
                setTwoFACodeVerified(true);
                setShow2FACodeVerification(false);
                break;
        }
    };

    const copyToClipboard = (text: string): void => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const twoFactorAuthURI = `otpauth://totp/HydroFund:${userData.email}?secret=${userData.twoFactorSecret}&issuer=HydroFund`;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            {/* Profile Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    {!isEditingProfile ? (
                        <button
                            onClick={handleProfileEdit}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <FiEdit className="mr-1" /> Edit
                        </button>
                    ) : (
                        <button
                            onClick={handleProfileCancel}
                            className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <FiX className="mr-1" /> Cancel
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        {isEditingProfile ? (
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                disabled
                            />
                        ) : (
                            <p className="mt-1">{profileData.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        {isEditingProfile ? (
                            <input
                                type="text"
                                value={profileData.username}
                                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        ) : (
                            <p className="mt-1">{profileData.username}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        {isEditingProfile ? (
                            <input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            />
                        ) : (
                            <p className="mt-1">{profileData.phone}</p>
                        )}
                    </div>

                    {isEditingProfile && (
                        <div className="pt-2">
                            {profileCodeVerified ? (
                                <button
                                    onClick={handleProfileUpdate}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    <FiSave className="mr-1" /> Verify Changes
                                </button>
                            ) : (
                                <button
                                    onClick={handleProfileVerify}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <FiCheck className="mr-1" /> Verify Changes
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Security</h2>

                {/* Password Subsection */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Password</h3>
                        {!isEditingPassword && canEditPassword() && (
                            <button
                                onClick={handlePasswordEdit}
                                className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                                <FiEdit className="mr-1" /> Change Password
                            </button>
                        )}
                        {isEditingPassword && (
                            <button
                                onClick={handlePasswordCancel}
                                className="flex items-center text-gray-600 hover:text-gray-800"
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
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPasswordFields({ ...showPasswordFields, new: !showPasswordFields.new })}
                                    >
                                        {showPasswordFields.new ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
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
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                    >
                                        <FiSave className="mr-1" /> Verify Password Change
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePasswordVerify}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        <FiCheck className="mr-1" /> Verify Password Change
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-gray-600">
                                Last changed: {new Date(userData.password.lastChanged).toLocaleDateString()}
                            </p>
                            {!canEditPassword() && (
                                <p className="text-sm text-yellow-600 mt-1">
                                    You can only change your password every 3 days. Next change available on {
                                        new Date(new Date(userData.password.lastChanged).getTime() + 3 * 24 * 60 * 60 * 1000
                                        ).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Two-Factor Authentication Subsection */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                        <button
                            onClick={!userData.twoFactorEnabled ? handle2FAToggle : handle2FAVerify}
                            className={`px-4 py-2 rounded-md ${userData.twoFactorEnabled
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
                                            onClick={() => copyToClipboard(userData.twoFactorSecret || '')}
                                            className="text-blue-600 hover:text-blue-800 flex items-center"
                                        >
                                            <FiCopy className="mr-1" /> Copy
                                        </button>
                                    </div>
                                    <div className='mt-4'>
                                        <label htmlFor="2fa">Enter OTP code to verify</label>
                                        <input
                                            type="text"
                                            value={faValue}
                                            name='2fa'
                                            onChange={(e) => setFaValue(e.target.value)}
                                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            onClick={twoFACodeVerified ? handle2FAUpdate : handle2FAVerify}
                                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            {twoFACodeVerified ? 'Submit'
                                                :
                                                <>
                                                    <FiCheck className="mr-1" /> Verify Code
                                                </>
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Code Verification Modals */}
            {showProfileCodeVerification && (
                <CodeVerification
                    onVerify={(code: string) => handleCodeVerificationComplete('profile', code)}
                    onCancel={() => setShowProfileCodeVerification(false)}
                    verifyType="profile"
                />
            )}

            {showPasswordCodeVerification && (
                <CodeVerification
                    onVerify={(code: string) => handleCodeVerificationComplete('password', code)}
                    onCancel={() => setShowPasswordCodeVerification(false)}
                    verifyType="password"
                />
            )}

            {show2FACodeVerification && (
                <CodeVerification
                    onVerify={(code) => handleCodeVerificationComplete('2fa', code)}
                    onCancel={() => setShow2FACodeVerification(false)}
                    verifyType="2fa"
                />
            )}
        </div>
    );
};

export default SettingsPage;