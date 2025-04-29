import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: {
        name: " ",
        email: " "
    },
    token: null, // שדה לאחסון הטוקן
};

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // פעולה לשמירת מידע על המשתמש
        saveUser: (state, action) => {
            console.log(action.payload);
            const { name, email } = action.payload;
            if (name !== null || email !== null) {
                state.user = action.payload;  // מעדכן את פרטי המשתמש
                console.log("user saving");
            }
        },
        
        // פעולה לשמירת טוקן
        saveToken: (state, action) => {
            console.log("Saving token:", action.payload);
            state.token = action.payload;  // שומר את הטוקן בנפרד
        },
    }
});

export const { saveUser, saveToken } = UserSlice.actions;
export default UserSlice.reducer;
