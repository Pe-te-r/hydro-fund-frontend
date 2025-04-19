import { createApi } from '@reduxjs/toolkit/query/react';
import {   ApiResponseType, HistoryType } from '../types/type';
import { ApiUrl } from './url';
import { createAuthApi } from './baseAuth';


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
    baseQuery: createAuthApi(`${ApiUrl}/withdraw`),
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