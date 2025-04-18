import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface DashboardResponse {
    balance: string;
    totalInvested: string;
    status: string;
    referralNo: number;
    referralAmount: number;
    totalWithdrawn: number;
    createdAt: string;
    vipTier: string;
    username: string;
    ownReferral: {
        referralCode: string;
    };
}

interface AdminDashboardResponse {
    status: string;
    message: string;
    data: {
        totals: {
            users: string;
            activeUsers: string;
            systemBalance: string;
            totalDeposited: string;
            totalWithdrawn: string;
            totalFees: string;
            totalInvested: string;
            activeInvestments: string;
            completedInvestments: string;
        };
        distributions: {
            vip: Array<{
                tier: string;
                count: string;
            }>;
            withdrawals: Array<{
                status: string;
                count: string;
                totalAmount: string;
            }>;
        };
        recentActivity: {
            withdrawals: Array<{
                id: string;
                userId: string;
                amount: string;
                netAmount: string;
                fee: string;
                phone: string;
                admin_info: string | null;
                status: string;
                createdAt: string;
                processedAt: string | null;
            }>;
        };
    };
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
        getAdminDashboard: builder.query<AdminDashboardResponse, void>({
            query: () => '',
            transformResponse: (response: AdminDashboardResponse) => response,
        }),
    }),
});

export const {
    useGetDashboardByIdQuery,
    useLazyGetDashboardByIdQuery,
    useGetAdminDashboardQuery,
    useLazyGetAdminDashboardQuery,
} = dashboardApi;