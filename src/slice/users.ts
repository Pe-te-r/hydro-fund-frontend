import { createApi } from '@reduxjs/toolkit/query/react';
import { UserResponse } from '../types/type';
import { ApiUrl } from './url';
import { createAuthApi } from './baseAuth';




export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: createAuthApi(`${ApiUrl}`),
    endpoints: (builder) => ({
        getUserById: builder.query<UserResponse, string>({
            query: (id) => `/users/${id}`,
            // Optional: Add transformResponse if you need to modify the API response
            transformResponse: (response: UserResponse) => {
                // You can transform the response here if needed
                return response;
            },
        }),
    }),
});

export const {
    useGetUserByIdQuery, // Hook for fetching user data
    useLazyGetUserByIdQuery // Optional: Lazy query version
} = userApi;