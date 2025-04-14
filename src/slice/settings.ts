import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LocalStorageUser } from '../types/type';

const ApiUrl = 'http://localhost:3000/settings';

// Type definitions
export interface UserSettings {
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
        baseUrl: ApiUrl,
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
            code: string;
        }>({
            query: ({ id, code }) => ({
                url: `/${id}`,
                method: 'PATCH',
                body: { code },
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