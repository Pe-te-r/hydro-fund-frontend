// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './slice/auth';

export const store = configureStore({
    reducer: {
        // authApi: authReducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;