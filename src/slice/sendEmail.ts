import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LocalStorageUser } from '../types/type';
import { ApiUrl as EmailUrl } from './url';

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
    baseQuery: fetchBaseQuery({
        baseUrl: EmailUrl,
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
