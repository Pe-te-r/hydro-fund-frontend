import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserResponse } from '../types/type';
import { ApiUrl } from './url';


// Define the user type for localStorage
interface LocalStorageUser {
    token: string;
    email: string;
    id: string;
}

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ApiUrl,
        prepareHeaders: (headers) => {
            // Safely get and parse user from localStorage
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
        getUserById: builder.query<UserResponse, string>({
            query: (id) => `/users/${id}`,
            // Optional: Add transformResponse if you need to modify the API response
            transformResponse: (response: UserResponse) => {
                // You can transform the response here if needed
                return response;
            },
        }),
    }),
});

export const {
    useGetUserByIdQuery, // Hook for fetching user data
    useLazyGetUserByIdQuery // Optional: Lazy query version
} = userApi;