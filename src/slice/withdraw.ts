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
        allHistory: builder.query<HistoryType,null>({
            query:() =>'/all'
        }),
        withdraw: builder.query<ResponseData,string>({
            query: (userId) => `/${userId}`,
        }),
        requestWithdrawal: builder.mutation<ResponseData, WithdrawRequest>({
            query: (withdrawRequest) => ({
                url: '', 
                method: 'POST',
                body: withdrawRequest,
            }),
        }),
        approvalWithdraw: builder.mutation<ApiResponseType, string>({
            query: (id) => ({
                url: `/approval`,
                method: 'PUT',
                body: { id:id }
            })
        }),

        histroyRequest: builder.query<HistoryType,string>({
            query: (userId) => ({
                url: `/transactions/${userId}`,
            }),
        }),
        cancelWithdraw: builder.mutation<ApiResponseType, { id: string; admin?: boolean,reason?:string }>({
            query: ({ id, admin,reason }) => ({
                url: admin ? `/cancel/${id}?admin=true` : `/cancel/${id}`,
                // params: admin ? { admin: 'true' } : undefined,
                body: {reason},
                method: 'POST',
            }),
        })
        
    }),
});

export const { useWithdrawQuery,useRequestWithdrawalMutation,useHistroyRequestQuery, useAllHistoryQuery,useCancelWithdrawMutation,useApprovalWithdrawMutation} = withdrawApi;