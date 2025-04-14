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

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [settingsApi.reducerPath]: settingsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [emailApi.reducerPath]: emailApi.reducer,
        [bonusApi.reducerPath]:bonusApi.reducer,
        [dashboardApi.reducerPath]:dashboardApi.reducer,
        [adminUserApi.reducerPath]: adminUserApi.reducer,
        [withdrawApi.reducerPath]: withdrawApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, bonusApi.middleware, withdrawApi.middleware, settingsApi.middleware, adminUserApi.middleware ,emailApi.middleware,dashboardApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;