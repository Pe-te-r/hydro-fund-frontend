// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './slice/auth';
import { userApi } from './slice/users';
import { bonusApi } from './slice/bonus';
import { settingsApi } from './slice/settings';
import { emailApi } from './slice/sendEmail';
import { dashboardApi } from './slice/dashboard';
import { adminUserApi } from './slice/admin/users';
import { withdrawApi } from './slice/withdraw';
import { investmentApi } from './slice/invest';
import { forgetApi } from './slice/forget';
import { otpApi } from './slice/code';

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [settingsApi.reducerPath]: settingsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [investmentApi.reducerPath]: investmentApi.reducer,
        [emailApi.reducerPath]: emailApi.reducer,
        [bonusApi.reducerPath]:bonusApi.reducer,
        [forgetApi.reducerPath]:forgetApi.reducer,
        [otpApi.reducerPath]:otpApi.reducer,
        [dashboardApi.reducerPath]:dashboardApi.reducer,
        [adminUserApi.reducerPath]: adminUserApi.reducer,
        [withdrawApi.reducerPath]: withdrawApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, otpApi.middleware,forgetApi.middleware,investmentApi.middleware ,userApi.middleware, bonusApi.middleware, withdrawApi.middleware, settingsApi.middleware, adminUserApi.middleware ,emailApi.middleware,dashboardApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;