import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface DashboardResponse {
    balance: string;
    totalInvested: string;
    status: string;
    referralNo: number;
    referralAmount: number;
    totalWithdrawn: number
    createdAt: string;
    vipTier: string
    ownReferral: {
        referralCode:string
    }


}


interface LocalStorageUser {
    token: string;
    email: string;
    id: string;
}

const ApiUrl = 'http://localhost:3000/dashboard';

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: ApiUrl,
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
        getDashboardById: builder.query<DashboardResponse, string>({
            query: (id) => `/${id}`,
            transformResponse: (response: DashboardResponse) => response,
        }),
    }),
});

export const {
    useGetDashboardByIdQuery,
    useLazyGetDashboardByIdQuery,
} = dashboardApi;
