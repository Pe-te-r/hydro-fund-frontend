// types.ts (additional types for the admin users)
import {  AdminUserServiceResponse, ApiResponse } from '../../types/type';
import { createAuthApi } from '../baseAuth';
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
import { createApi } from '@reduxjs/toolkit/query/react';


export const adminUserApi = createApi({
    reducerPath: 'adminUserApi',
    baseQuery: createAuthApi(`${AdminUserApiUrl}/admin`),
    tagTypes: ['AdminUsers'], // For cache invalidation
    endpoints: (builder) => ({
        getAdminUsers: builder.query<AdminUsersResponse, void>({
            query: () => '/users', // Adjust the endpoint as needed
            providesTags: ['AdminUsers'], // For cache invalidation
        }),
        getOneUser: builder.query<ApiResponse<AdminUserServiceResponse>, string>({
            query: (id) => `/users/${id}` ,// Adjust the endpoint as needed
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

export const { useGetAdminUsersQuery, useUpdateUserStatusMutation,useGetOneUserQuery } = adminUserApi;