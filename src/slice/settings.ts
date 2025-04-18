import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LocalStorageUser } from '../types/type';
import { ApiUrl } from './url';

// Type definitions
export interface UserSettings {
    id: string;
    email: string;
    username: string;
    phone: string;
    twoFactorSecret?: string;
    twoFactorEnabled: boolean;
    password: {
        lastChanged: string;
    };
}

interface SettingsResponse {
    status: string;
    message: string;
    data: UserSettings;
}

interface UpdateSettingsRequest {
    id: string;
    username?: string;
    phone?: string;
    password?: {
        new: string;
        old: string;
    };
    twoFactorEnabled?: boolean;
}

interface UpdateSettingsResponse {
    success: boolean;
    message: string;
}

export const settingsApi = createApi({
    reducerPath: 'settingsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${ApiUrl}/settings`,
        prepareHeaders: (headers) => {
            const userString = localStorage.getItem('user');
            if (userString) {
                try {
                    const user: LocalStorageUser = JSON.parse(userString);
                    if (user?.token) {
                        headers.set('Authorization', `Bearer ${user.token}`);
                    }
                } catch (error) {
                    console.error('Failed to parse user from localStorage', error);
                }
            }
            return headers;
        },
    }),
    tagTypes: ['Settings'], // For cache invalidation
    endpoints: (builder) => ({
        // Get user settings
        settingsInfo: builder.query<SettingsResponse, string>({
            query: (userId) => `/${userId}`,
            providesTags: ['Settings'],
        }),

        // Update user settings
        updateSettings: builder.mutation<UpdateSettingsResponse, UpdateSettingsRequest>({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Settings'], // Invalidate cache after update
        }),

        // Update two-factor authentication status
        updateTwoFactorAuth: builder.mutation<UpdateSettingsResponse, {
            id: string;
            twoFactorSecretCode: string;
            twoFactorEnabled?:boolean
        }>({
            query: ({ id, twoFactorSecretCode, twoFactorEnabled }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: { twoFactorSecretCode, twoFactorEnabled },
            }),
            invalidatesTags: ['Settings'],
        }),
    }),
});

export const {
    useSettingsInfoQuery,
    useUpdateSettingsMutation,
    useUpdateTwoFactorAuthMutation,
} = settingsApi;