import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {  LocalStorageUser } from '../types/type';

const ApiUrl = 'http://localhost:3000/withdraw';

interface ResponseData{
    status: string;
    message: string
    data: {
        phone: string;
        amount: number;
    }
}

export const withdrawApi = createApi({
    reducerPath: 'withdrawApi',
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
        withdraw: builder.query<ResponseData, string>({
            query: (userId) => `/${userId}`,
        }),

    }),
});

export const { useWithdrawQuery} = withdrawApi;