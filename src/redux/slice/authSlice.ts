import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    token: null,
    roles: []
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData: (state, action) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.token = action.payload.token;
            state.roles = action.payload.roles;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.roles = [];
        }
    }
});

export const { setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
