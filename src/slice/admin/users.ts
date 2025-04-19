// types.ts (additional types for the admin users)
import { ApiUrl as AdminUserApiUrl } from '../url';
export interface AdminUser {
    balance: string;
    email: string;
    status: string;
    phone: string;
    vipTier: string;
    lastLogin: string;
    id:string
}

export interface AdminUsersResponse {
    status: string;
    message: string;
    data: {
        users: AdminUser[];
    };
}
export interface LocalStorageUser{
    token?: string;
    id?:string
}


// adminUserApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const adminUserApi = createApi({
    reducerPath: 'adminUserApi',
    baseQuery: fetchBaseQuery({
        baseUrl: AdminUserApiUrl,
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
    tagTypes: ['AdminUsers'], // For cache invalidation
    endpoints: (builder) => ({
        getAdminUsers: builder.query<AdminUsersResponse, void>({
            query: () => '/users', // Adjust the endpoint as needed
            providesTags: ['AdminUsers'], // For cache invalidation
        }),
        updateUserStatus: builder.mutation<
            AdminUsersResponse,
            { email: string; status: string }
        >({
            query: ({ email, status }) => ({
                url: `/users/${email}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['AdminUsers'], // Invalidate cache after update
        }),
        // Add more admin endpoints as needed
    }),
});

export const { useGetAdminUsersQuery, useUpdateUserStatusMutation } = adminUserApi;