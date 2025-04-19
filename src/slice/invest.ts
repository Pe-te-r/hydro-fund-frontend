// services/investmentApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ApiUrl } from './url';

// Types
interface OrderItem {
    id?: string;
    orderId?: string;
    productId: string | number;
    productName: string;
    quantity: number;
    price: number;
    dailyIncome: number;
    totalIncome: number;
    cycle: number;
    createdAt?: string;
}

export interface Order {
    id?: string;
    userId?: string;
    totalAmount: string;
    status: string;
    createdAt?: string;
    claimed: boolean;
    updatedAt?: string;
    items: OrderItem[];
}

interface ApiResponse<T> {
    status: 'success' | 'error';
    message: string;
    data: T;
}

interface CreateOrderRequest {
    userId: string;
    items: OrderItem[];
    totalAmount: number;
}

export const investmentApi = createApi({
    reducerPath: 'investmentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${ApiUrl}/invest`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        // Create new investment order (maintained as is)
        createOrder: builder.mutation<ApiResponse<string>, CreateOrderRequest>({
            query: (orderData) => ({
                url: '',
                method: 'POST',
                body: orderData
            }),
            invalidatesTags: ['Orders'],
        }),

        // Get all orders for a specific user
        getUserOrders: builder.query<ApiResponse<Order[]>, string>({
            query: (userId) => ({
                url: `/${userId}/orders`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Orders' as const, id })),
                        { type: 'Orders', id: 'LIST' },
                    ]
                    : [{ type: 'Orders', id: 'LIST' }],
        }),

        // Get single order by ID
        getOrderById: builder.query<ApiResponse<Order>, string>({
            query: (orderId) => ({
                url: `/order/${orderId}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Orders', id }],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetUserOrdersQuery,
    useGetOrderByIdQuery,
} = investmentApi;