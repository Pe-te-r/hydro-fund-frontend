// deposit.api.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { createAuthApi } from './baseAuth';
import { ApiUrl } from './url';

// Define types based on your schema and responses
export type DepositData = {
    userId: string;
    amount: string;
    phone: string;
    code: string;
};

export type DepositResponse = {
    id: string;
    amount: string;
    phone: string;
    status: string;
    code: string;
    createdAt: string;
    user?: {
        email: string;
    };
};

export type DepositListResponse = {
    status: 'success' | 'error';
    message: string;
    data: DepositResponse[];
};

export type UpdateDepositParams = {
    id: string;
};

export const depositApi = createApi({
    reducerPath: 'depositApi',
    baseQuery: createAuthApi(ApiUrl),
    tagTypes: ['Deposit'],
    endpoints: (builder) => ({
        // Get all deposits
        getAllDeposits: builder.query<DepositListResponse, void>({
            query: () => '/deposit',
            providesTags: ['Deposit'],
        }),

        // Create new deposit
        createDeposit: builder.mutation<{ status: string; message: string }, DepositData>({
            query: (depositData) => ({
                url: '/deposit',
                method: 'POST',
                body: depositData,
            }),
            invalidatesTags: ['Deposit'],
        }),

        // Update deposit status
        updateDeposit: builder.mutation<{ status: string; message: string }, UpdateDepositParams>({
            query: ({ id }) => ({
                url: `/deposit/${id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Deposit'],
        }),
    }),
});

export const {
    useGetAllDepositsQuery,
    useCreateDepositMutation,
    useUpdateDepositMutation,
} = depositApi;