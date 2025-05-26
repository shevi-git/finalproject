import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: localStorage.getItem('authToken') || null,
    role: localStorage.getItem('userRole') || null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        saveUser: (state, action) => {
            state.user = action.payload;
            if (action.payload?.role) {
                state.role = action.payload.role;
                localStorage.setItem('userRole', action.payload.role);
            }
        },
        saveToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem('authToken', action.payload);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
        }
    }
});

export const { saveUser, saveToken, logout } = userSlice.actions;
export default userSlice.reducer; 