// otp.api.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthApi } from './baseAuth';
import { ApiUrl } from './url';
import { ApiResponse, codeVerifyRequest } from '../types/type';

export const otpApi = createApi({
    reducerPath: 'otpApi',
    baseQuery: createAuthApi(`${ApiUrl}/verify`),
    endpoints: (builder) => ({
        verifyOtp: builder.mutation<ApiResponse<null>, codeVerifyRequest>({
            query: (credentials) => ({
                url: '/otp',
                method: 'POST',
                body: credentials,
            }),
        }),
        verifyCode: builder.mutation<ApiResponse<boolean>, codeVerifyRequest>({
            query: (credentials) => ({
                url: '/code',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const {
    useVerifyOtpMutation,
    useVerifyCodeMutation
} = otpApi;