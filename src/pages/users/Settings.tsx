import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSettingsInfoQuery, useUpdateSettingsMutation, useUpdateTwoFactorAuthMutation } from '../../slice/settings';
import { useAuth } from '../../context/AuthContext';
import ProfileInformation from '../../components/ProfileSection';
import SecuritySettings from '../../components/SecuritySettings';
import { ErrorResponse } from '../../types/type';

type dataType={
    id:string,
    email: string,
    username: string,
    phone: string

}

const SettingsPage = () => {
    const { user } = useAuth();
    const { data: settingsData, isLoading, isError, refetch } = useSettingsInfoQuery(user?.id || '', {
        refetchOnFocus: true,
        refetchOnReconnect: true,
        refetchOnMountOrArgChange: true
    });
    const [updateUser] = useUpdateSettingsMutation();
    const [update2FA] = useUpdateTwoFactorAuthMutation();

    const [userData, setUserData] = useState(settingsData?.data);

    useEffect(() => {
        if (settingsData?.data) {
            setUserData(settingsData.data);
        }
    }, [settingsData]);

    

    const handleProfileUpdate = async (data: dataType) => {
        try {
            const info = await updateUser(data).unwrap();
            toast.success(info.message);
            await refetch();
        } catch (err) {
            const error = err as { status: number, data: ErrorResponse }
            console.log(error)
            toast.error(error.data.message);
        }
    };

    const handlePasswordUpdate = async (data: { old: string; new: string }) => {
        try {
            const info = await updateUser({
                password: { new: data.new, old: data.old },
                id: user?.id || ''
            }).unwrap();
              
            toast.success(info.message);
            await refetch();
        } catch (err) {
            const error = err as {status:number,data:ErrorResponse}
            if (error.data?.message) {
                toast.error(error.data.message);
            } 
        }
    };

    const handle2FAUpdate = async (data: { code?: string; enabled: boolean }) => {
        try {
            const info = await update2FA({
                id: user?.id || '',
                twoFactorSecretCode: data.code || '',
                twoFactorEnabled: data.enabled
            }).unwrap();
            toast.success(info.message);
            await refetch();
        } catch (err) {
            const error = err as {status:number,data:ErrorResponse}
            if (error.data?.message) {
                toast.error(error.data.message);
            } else {
                toast.error(`Failed to ${data.enabled ? 'enable' : 'disable'} 2FA`);
            }
        }
    };

    if (isLoading) return <div>Loading settings...</div>;
    if (isError) return <div>Error loading settings</div>;
    if (!userData) return <div>No user data found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <ProfileInformation
                userData={userData}
                onUpdate={handleProfileUpdate}
            />

            <SecuritySettings
                userData={userData}
                onPasswordUpdate={handlePasswordUpdate}
                on2FAUpdate={handle2FAUpdate}
            />
        </div>
    );
};

export default SettingsPage;