// services/authApi.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/type';
import { ApiUrl } from './url';
import { createAuthApi } from './baseAuth';




export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: createAuthApi(`${ApiUrl}/auth`),
    endpoints: (builder) => ({
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (credentials) => ({
                url: '/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
} = authApi;