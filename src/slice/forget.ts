// forget.api.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthApi } from './baseAuth';
import { ApiUrl } from './url';
import { ApiResponse, changePasswordRequest, initialRequestPassword } from '../types/type';

export const forgetApi = createApi({
    reducerPath: 'forgetApi',
    baseQuery: createAuthApi(`${ApiUrl}/forget`),
    endpoints: (builder) => ({
        initiatePasswordReset: builder.mutation<ApiResponse<{code:boolean,otp:boolean}>, initialRequestPassword>({
            query: (credentials) => ({
                url: '',
                method: 'POST',
                body: credentials,
            }),
        }),
        changePassword: builder.mutation<ApiResponse<null>, changePasswordRequest>({
            query: (credentials) => ({
                url: '/new',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const {
    useInitiatePasswordResetMutation,
    useChangePasswordMutation
} = forgetApi;