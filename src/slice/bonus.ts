import { createApi } from '@reduxjs/toolkit/query/react';
import { BonusClaimRequest, BonusClaimResponse } from '../types/type';
import { ApiUrl } from './url';
import { createAuthApi } from './baseAuth';


export const bonusApi = createApi({
    reducerPath: 'bonusApi',
    baseQuery: createAuthApi(`${ApiUrl}/bonus`),
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