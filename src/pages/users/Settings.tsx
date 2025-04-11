import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const staticCode = '1234';

interface UserSettings {
    id: string;
    email: string;
    username: string;
    phone: string;
    twoFactorSecret: string;
    twoFactorEnabled: boolean;
    password: {
        lastChanged: string;
    };
}

const mockData: UserSettings = {
    id: '773c8ea0-97de-4b34-9113-0195b0e8b770',
    email: 'shakirah@gmail.com',
    username: 'shakirah',
    phone: '0741195000',
    twoFactorSecret: 'CAGA4M2MIIDWCSR3',
    twoFactorEnabled: false,
    password: {
        lastChanged: '2025-04-11T13:09:17.029Z',
    },
};

export default function SettingsPage() {
    const [data] = useState<UserSettings>(mockData);
    const [isVerified, setIsVerified] = useState(false);
    const [otpInput, setOtpInput] = useState('');
    const [editingProfile, setEditingProfile] = useState(false);
    const [editingSecurity, setEditingSecurity] = useState(false);
    const [form, setForm] = useState({
        username: data.username,
        phone: data.phone,
        password: {
            old: '',
            new: '',
        },
        twoFactorEnabled: data.twoFactorEnabled,
    });

    useEffect(() => {
        if (otpInput === staticCode) {
            setIsVerified(true);
            console.log('Code verified!');
        }
    }, [otpInput]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.includes('password.')) {
            setForm((prev) => ({
                ...prev,
                password: {
                    ...prev.password,
                    [name.split('.')[1]]: value,
                },
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = () => {
        console.log('Submitted:', form);
    };

    const canChangePassword = dayjs().diff(dayjs(data.password.lastChanged), 'day') > 3;

    const handleSendCode = () => {
        console.log('Sending OTP:', staticCode);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-6 md:px-20">
            {!isVerified && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 shadow">
                    <p className="text-sm text-blue-600 font-semibold">Enter Verification Code:</p>
                    <input
                        type="text"
                        className="mt-2 p-2 w-full border rounded"
                        placeholder="Enter code"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                    />
                </div>
            )}

            <div className="bg-white rounded-xl shadow p-6 space-y-10">
                {/* Profile Section */}
                <div>
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <h2 className="text-xl font-bold text-gray-700">Profile</h2>
                        {!editingProfile && (
                            <button
                                onClick={() => {
                                    setEditingProfile(true);
                                    handleSendCode();
                                }}
                                className="text-blue-500 hover:underline"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm text-gray-600">Email</label>
                            <input
                                disabled
                                value={data.email}
                                className="p-2 border rounded w-full bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Username</label>
                            <input
                                disabled={!editingProfile}
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="p-2 border rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600">Phone</label>
                            <input
                                disabled={!editingProfile}
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="p-2 border rounded w-full"
                            />
                        </div>
                    </div>
                    {editingProfile && isVerified && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => {
                                    handleSubmit();
                                    setEditingProfile(false);
                                }}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>

                {/* Security Section */}
                <div>
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <h2 className="text-xl font-bold text-gray-700">Security</h2>
                        {!editingSecurity && (
                            <button
                                onClick={() => {
                                    setEditingSecurity(true);
                                    handleSendCode();
                                }}
                                className="text-blue-500 hover:underline"
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    {/* Password Section */}
                    <div className="mb-6">
                        <h3 className="text-md font-semibold text-gray-700 mb-2">Password</h3>
                        <p className="text-sm text-gray-500 mb-2">
                            Last changed: {dayjs(data.password.lastChanged).format('YYYY-MM-DD')}
                        </p>
                        {canChangePassword ? (
                            editingSecurity && isVerified && (
                                <div className="grid gap-4 md:grid-cols-2">
                                    <input
                                        type="password"
                                        name="password.old"
                                        placeholder="Old Password"
                                        className="p-2 border rounded w-full"
                                        value={form.password.old}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="password"
                                        name="password.new"
                                        placeholder="New Password"
                                        className="p-2 border rounded w-full"
                                        value={form.password.new}
                                        onChange={handleChange}
                                    />
                                </div>
                            )
                        ) : (
                            <p className="text-red-500">Password cannot be changed within 3 days.</p>
                        )}
                    </div>

                    {/* 2FA Section */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-700 mb-2">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500 mb-2">
                            Status: {form.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </p>
                        {editingSecurity && isVerified && (
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => {
                                        const newValue = !form.twoFactorEnabled;
                                        setForm({ ...form, twoFactorEnabled: newValue });
                                        console.log('OTP to enable/disable 2FA:', staticCode);
                                    }}
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    {form.twoFactorEnabled ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        )}
                    </div>

                    {editingSecurity && isVerified && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => {
                                    handleSubmit();
                                    setEditingSecurity(false);
                                }}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
