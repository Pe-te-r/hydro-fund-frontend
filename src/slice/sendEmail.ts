import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LocalStorageUser } from '../types/type';

const EmailUrl = 'http://localhost:3000/email';

// Response format
interface EmailResponse {
    status: string;
    message: string;
    data: boolean;
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
    }),
});

export const { useSendEmailQuery } = emailApi;
