import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {   ApiResponseType, HistoryType, LocalStorageUser } from '../types/type';

const ApiUrl = 'http://localhost:3000/withdraw';

interface ResponseData{
    status: string;
    message: string
    data: {
        phone: string;
        amount: number;
    }
}

interface WithdrawRequest{
    userId: string,
    amount: number,
    netAmount: number,
    fee: number,
    phone: string,
    admin_info?:string,
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
        requestWithdrawal: builder.mutation<ResponseData, WithdrawRequest>({
            query: (withdrawRequest) => ({
                url: '', 
                method: 'POST',
                body: withdrawRequest,
            }),
        }),

        histroyRequest: builder.query<HistoryType, string>({
            query: (userId) => `/transactions/${userId}`
        }),
        cancelWithdraw: builder.mutation<ApiResponseType, string>({
            query: (id) => ({
                url: `/cancel/${id}`, // Update to your actual endpoint
                method: 'POST', // Consider using POST for state-changing operations
            }),
        })

    }),
});

export const { useWithdrawQuery,useRequestWithdrawalMutation,useHistroyRequestQuery,useCancelWithdrawMutation} = withdrawApi;