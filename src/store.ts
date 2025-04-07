// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './slice/auth';
import { userApi } from './slice/users';
import { bonusApi } from './slice/bonus';

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]:userApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [bonusApi.reducerPath]:bonusApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware,userApi.middleware,bonusApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;