import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserResponse } from '../types/type';

const ApiUrl = 'http://localhost:3000';

interface LocalStorageUser {
    token: string;
    email: string;
    id: string;
}

// Define the update payload type
interface UpdateSettingsPayload {
    id: string;
    data: {
        username?: string;
        email?: string;
        phone?: string;
        password?: {
            old: string;
            new: string;
        };
        code?: string;
    };
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
    endpoints: (builder) => ({
        // Existing query endpoint
        settingsInfo: builder.query<UserResponse, string>({
            query: (id) => `/settings/${id}`,
        }),

        // New mutation endpoint for updates
        updateSettings: builder.mutation<{ success: boolean; message: string }, UpdateSettingsPayload>({
            query: ({ id, data }) => ({
                url: `/settings/${id}`,
                method: 'PATCH',
                body: data,
            }),
            // Transform the response if needed
            transformResponse: (response: { success: boolean; message: string }) => response,
            // Invalidate cache for this user's data after successful update
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    dispatch(settingsApi.util.invalidateTags(['Settings']));
                } catch (error) {
                    console.error('Failed to invalidate cache:', error);
                }
            },
        }),
    }),
    // Optional: Add tags for cache invalidation
    tagTypes: ['Settings'],
});

export const {
    useSettingsInfoQuery,
    useLazySettingsInfoQuery,
    useUpdateSettingsMutation, // New mutation hook
} = settingsApi;