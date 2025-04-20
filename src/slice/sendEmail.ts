import { createApi,  } from '@reduxjs/toolkit/query/react';
import { ApiUrl as EmailUrl } from './url';
import { createAuthApi } from './baseAuth';

// Response format
interface EmailResponse {
    status: string;
    message: string;
    data: boolean;
}

interface VerifyCodeRequest {
    id: string;
    code: string;
}

export const emailApi = createApi({
    reducerPath: 'emailApi',
    baseQuery: createAuthApi(`${EmailUrl}/email`),
    endpoints: (builder) => ({
        sendEmail: builder.query<EmailResponse, string>({
            query: (userId) => `/${userId}`,
        }),
        verifyCode: builder.mutation<EmailResponse, VerifyCodeRequest>({
            query: ({ id, code }) => ({
                url: `/${id}`,
                method: 'POST',
                body: { code },
            }),
        }),
    }),
});

export const { useSendEmailQuery,useVerifyCodeMutation } = emailApi;
