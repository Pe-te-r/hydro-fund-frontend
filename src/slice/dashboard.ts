import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiUrl } from './url';
import { createAuthApi } from './baseAuth';

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
            investments: Array<{
                status: string;
                count: string;
                totalAmount: string;
            }>;
            referrals: Array<{
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
                fee: string;
                phone: string;
                admin_info: string;
                status: string;
                // createAt: string;
                createdAt: string;
                processedAt?: string;
                user: {
                    phone: string;
                    email: string;
                }
            }>;
            investments: Array<{
                id: string;
                userId: string;
                totalAmount: string;
                status: string;
                claimed: boolean;
                createdAt: string;
                user: {
                    phone: string;
                    email: string;
                }
                updatedAt: string;
            }>;
        };
        growth: {
            users: Array<{
                date: string;
                count: string;
            }>;
        };
    };
}



export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: createAuthApi(`${ApiUrl}/dashboard`),
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