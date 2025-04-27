import { useState, useEffect } from 'react';
import { FiEdit, FiSave, FiX, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { UserSettings } from '../slice/settings';
import { CodeVerification } from '../context/CodeVerification';

interface ProfileInformationProps {
    userData: UserSettings;
    onUpdate: (data: ProfileData) => Promise<void>;
}

interface ProfileData {
    id: string;
    email: string;
    username: string;
    phone: string;
}

const ProfileInformation = ({ userData, onUpdate }: ProfileInformationProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        phone: userData.phone
    });
    const [showCodeVerification, setShowCodeVerification] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);

    useEffect(() => {
        setProfileData({
            id: userData.id,
            email: userData.email,
            username: userData.username,
            phone: userData.phone
        });
    }, [userData]);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setIsEditing(false);
        setCodeVerified(false);
        setProfileData({
            id: userData.id,
            email: userData.email,
            username: userData.username,
            phone: userData.phone
        });
    };

    const handleVerify = () => setShowCodeVerification(true);

    const handleUpdate = async () => {
        try {
            await onUpdate(profileData);
            setIsEditing(false);
            setCodeVerified(false);
        } catch (error) {
            console.log(error)
            toast.error('Failed to update profile');
        }
    };

    const handleCodeVerificationComplete = (code: string) => {
        console.log('Verification code:', code);
        setCodeVerified(true);
        setShowCodeVerification(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                {!isEditing ? (
                    <button onClick={handleEdit} className="flex cursor-pointer items-center text-blue-600 hover:text-blue-800">
                        <FiEdit className="mr-1" /> Edit
                    </button>
                ) : (
                    <button onClick={handleCancel} className="flex cursor-pointer items-center text-gray-600 hover:text-gray-800">
                        <FiX className="mr-1" /> Cancel
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    {isEditing ? (
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
                    {isEditing ? (
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
                    {isEditing ? (
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

                {isEditing && (
                    <div className="pt-2">
                        {codeVerified ? (
                            <button
                                onClick={handleUpdate}
                                className="flex cursor-pointer items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                <FiSave className="mr-1" /> Save Changes
                            </button>
                        ) : (
                            <button
                                onClick={handleVerify}
                                className="flex cursor-pointer items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <FiCheck className="mr-1" /> Verify Changes
                            </button>
                        )}
                    </div>
                )}
            </div>

            {showCodeVerification && (
                <CodeVerification
                    onVerify={handleCodeVerificationComplete}
                    onCancel={() => setShowCodeVerification(false)}
                    verifyType="profile"
                />
            )}
        </div>
    );
};

export default ProfileInformation;