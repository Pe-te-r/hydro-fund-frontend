import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useGetUserByIdQuery } from '../../slice/users';
import { FiClipboard, FiLink } from 'react-icons/fi';
import { useClaimBonusMutation, useAccounBonusMutation } from '../../slice/bonus';

export default function AccountPage() {
    const { user: authUser } = useAuth();
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState('');

    // Data fetching
    const {
        data: userData,
        isLoading,
        isError,
        refetch: refetchUser,
    } = useGetUserByIdQuery(authUser?.id || '', {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true,
    });

    // Bonus mutations
    const [claimReferralBonus, { isLoading: isClaimingReferral }] = useClaimBonusMutation();
    const [claimAccountBonus, { isLoading: isClaimingAccount }] = useAccounBonusMutation();

    // Mask email for privacy
    const maskEmail = (email: string) => {
        const [name, domain] = email.split('@');
        const maskedName = name.length > 3
            ? `${name.substring(0, 2)}***${name.slice(-1)}`
            : '***';
        return `${maskedName}@${domain}`;
    };

    // Generate share URL
    useEffect(() => {
        if (userData?.data.referralCode) {
            const baseUrl = window.location.origin;
            setShareUrl(`${baseUrl}/join?ref=${userData.data.referralCode}`);
        }
    }, [userData]);

    // Handle referral bonus claim
    const handleClaimReferralBonus = async (referralId: string) => {
        try {
            console.log(referralId)
            const response = await claimReferralBonus({ id: referralId }).unwrap();
            toast[response.status](response.message);
            if (response.status === 'success') {
                refetchUser();
            }
        } catch (error) {
            console.log(error)
            toast.error('Failed to claim referral bonus');
        }
    };

    // Handle account bonus claim
    const handleClaimAccountBonus = async () => {
        try {
            const response = await claimAccountBonus({ id: authUser?.id || '' }).unwrap();
            toast[response.status](response.message);
            if (response.status === 'success') {
                refetchUser();
            }
        } catch (error) {
            console.log(error)
            toast.error('Failed to claim account bonus');
        }
    };

    // Copy to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError || !userData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Error loading account data</p>
                <button
                    onClick={() => refetchUser()}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    const user = userData.data;
    console.log(user.referredUsers)
    const showAccountBonus = user.bonus?.status === 'pending'

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Account Header */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Account Overview</h1>
                                <p className="text-gray-600 mt-1">Welcome back, {user.username}!</p>
                            </div>
                            <div className={`px-4 py-2 rounded-full text-sm font-medium ${user.vipTier === 'bronze' ? 'bg-amber-100 text-amber-800' :
                                    user.vipTier === 'silver' ? 'bg-gray-100 text-gray-800' :
                                        'bg-purple-100 text-purple-800'
                                }`}>
                                Tier: {user.vipTier.charAt(0).toUpperCase() + user.vipTier.slice(1)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* User Information Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Username</p>
                                    <p className="font-medium">{user.username}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Status</p>
                                    <p className="font-medium capitalize">{user.status}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Email</p>
                                <p className="font-medium">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Phone</p>
                                <p className="font-medium">{user.phone}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Member Since</p>
                                    <p className="font-medium">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Last Login</p>
                                    <p className="font-medium">
                                        {new Date(user.lastLogin).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Stats Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Stats</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Account Balance</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        ${parseFloat(user.balance).toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Total Invested</p>
                                    <p className="text-xl font-medium text-gray-800">
                                        ${parseFloat(user.totalInvested).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-sm">Total Withdrawn</p>
                                    <p className="text-xl font-medium text-gray-800">
                                        ${parseFloat(user.totalWithdrawn).toFixed(2)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Profile Complete</p>
                                    <p className="font-medium">
                                        {user.profileComplete ? (
                                            <span className="text-green-600">Completed</span>
                                        ) : (
                                            <span className="text-amber-600">Incomplete</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Referral Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="p-6 sm:p-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Referral Program</h2>

                        {/* Referral Code Card */}
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <h3 className="font-medium text-gray-800 mb-2">Your Referral Code</h3>
                            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                <div className="flex-1 bg-white p-3 rounded-md border border-gray-200 flex justify-between items-center">
                                    <code className="font-mono text-blue-600">{user.referralCode}</code>
                                    <button
                                        onClick={() => copyToClipboard(user.referralCode)}
                                        className="ml-2 p-1 text-gray-500 hover:text-blue-600 cursor-pointer"
                                    >
                                        <FiClipboard className="h-5 w-5" />
                                    </button>
                                </div>
                                {copied && (
                                    <span className="text-sm text-green-600">Copied!</span>
                                )}
                            </div>
                        </div>

                        {/* Share Link Card */}
                        <div className="bg-amber-50 p-4 rounded-lg mb-6">
                            <h3 className="font-medium text-gray-800 mb-2">Your Shareable Link</h3>
                            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                <div className="flex-1 bg-white p-3 rounded-md border border-gray-200 overflow-x-auto">
                                    <p className="text-sm text-blue-600 truncate">{shareUrl}</p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(shareUrl)}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                                >
                                    <FiLink className="h-4 w-4 mr-1" />
                                    Copy Link
                                </button>
                            </div>
                        </div>

                        {/* Referred By Section */}
                        {user.referredBy.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-medium text-gray-800 mb-3">You Were Referred By</h3>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="flex-1">
                                            <p className="font-medium">{maskEmail(user.referredBy[0].referrer.email)}</p>
                                            <p className="text-sm text-gray-600">Welcome bonus applied</p>
                                        </div>
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Your Referrals Section */}
                        <div>
                            <h3 className="font-medium text-gray-800 mb-3">Your Referrals</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Earn rewards for each friend who joins using your referral code.
                            </p>

                            {user.referredUsers.length > 0 ? (
                                <div className="space-y-3">
                                    {user.referredUsers.map((referral, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg">
                                            <div className="mb-2 sm:mb-0">
                                                <p className="font-medium">{maskEmail(referral.referred.email)}</p>
                                                <p className="text-sm text-gray-500">
                                                    Bonus: ${referral.bonusAmount} •
                                                    Status: <span className={
                                                        referral.bonusStatus === 'pending' ? 'text-amber-600' :
                                                            referral.bonusStatus === 'completed' ? 'text-green-600' :
                                                                'text-red-600'
                                                    }>
                                                        {referral.bonusStatus}
                                                    </span>
                                                </p>
                                            </div>
                                            {referral.bonusStatus === 'pending' ? (
                                                <button
                                                    onClick={() => handleClaimReferralBonus(referral.referred.id )}
                                                    disabled={isClaimingReferral}
                                                    className={`px-3 py-1 rounded text-sm font-medium transition cursor-pointer ${isClaimingReferral
                                                            ? 'bg-gray-400 text-white'
                                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                        }`}
                                                >
                                                    {isClaimingReferral ? 'Processing...' : 'Claim Bonus'}
                                                </button>
                                            ) : referral.bonusStatus === 'completed' ? (
                                                <span className="text-green-600 text-sm font-medium">Claimed</span>
                                            ) : (
                                                <span className="text-red-600 text-sm font-medium">Expired</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <p className="text-gray-500">You haven't referred anyone yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* New Account Bonus Section - Only shown if bonus is pending */}
                {showAccountBonus && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-50 to-blue-50">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">New Account Bonus</h2>
                            <p className="text-gray-600 mb-4">Claim your $50 welcome bonus for joining Hydro Fund!</p>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                                <div>
                                    <h3 className="font-medium text-gray-800">$50 Welcome Bonus</h3>
                                    <p className="text-gray-600 text-sm">Available for new accounts</p>
                                </div>
                                <button
                                    onClick={handleClaimAccountBonus}
                                    disabled={isClaimingAccount}
                                    className={`px-4 py-2 rounded font-medium transition cursor-pointer ${isClaimingAccount
                                            ? 'bg-gray-400 text-white'
                                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                                        }`}
                                >
                                    {isClaimingAccount ? 'Processing...' : 'Claim Bonus'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}