// services/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';



interface RegisterRequest {
    username: string;
    email: string;
    phone: string;
    password: string;
    inviteCode?: string;
}

interface LoginRequest {
    identifier: string; // Can be email, username, or phone
    password: string;
}

interface AuthResponse {
    status: string,
    message: string,
    data: {   
        user: {
            id: string;
            username: string;
            email: string;
            phone: string;
        };
        token: string;
    }
}

const ApiUrl ='http://localhost:3000'

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${ApiUrl}/auth`,
    }),
    endpoints: (builder) => ({
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (credentials) => ({
                url: '/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
} = authApi;