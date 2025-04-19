import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BonusClaimRequest, BonusClaimResponse, LocalStorageUser } from '../types/type';
import { ApiUrl } from './url';


export const bonusApi = createApi({
    reducerPath: 'bonusApi',
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
        claimBonus: builder.mutation<BonusClaimResponse, BonusClaimRequest>({
            query: ({ id }) => ({
                url: `/new/${id}`,
                method: 'PATCH',
            }),

        }),
        accounBonus: builder.mutation<BonusClaimResponse, BonusClaimRequest>({
            query: ({ id }) => ({
                url: `/account/${id}`,
                method: 'PATCH',
            }),

        }),
    }),
});

export const { useClaimBonusMutation, useAccounBonusMutation } = bonusApi;