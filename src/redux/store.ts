import { configureStore } from '@reduxjs/toolkit';
import loadingSlice from './slice/loadingSlice';
import authSlice from './slice/authSlice';

export const store = configureStore({
    reducer: {
        loading: loadingSlice,
        auth: authSlice,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
