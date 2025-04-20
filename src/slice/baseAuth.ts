// src/api/apiUtils.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

export const createAuthApi = (baseUrl: string) => {
    const baseQuery = fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
            const userString = localStorage.getItem('user');
            if (userString) {
                try {
                    const user = JSON.parse(userString);
                    if (user?.token) {
                        headers.set('Authorization', `Bearer ${user.token}`);
                    }
                } catch (error) {
                    console.error('Failed to parse user from localStorage', error);
                }
            }
            return headers;
        },
    });

    const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
        async (args, api, extraOptions) => {
            const result = await baseQuery(args, api, extraOptions);

            // Only handle token-related errors
            if (result.error) {
                // Check if it's a token error from the server
                const isTokenError =
                    // Check for the token flag in the error response
                    (result.error.data && typeof result.error.data === 'object' &&
                        'token' in result.error.data && result.error.data.token === true)
                if (isTokenError) {
                    localStorage.removeItem('user');
                    // Optional: dispatch logout action
                    // api.dispatch(logout());
                    window.location.href = '/login';
                }
            }

            return result;
        };
    return baseQueryWithAuth;
};