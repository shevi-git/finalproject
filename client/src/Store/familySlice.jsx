import { createSlice } from '@reduxjs/toolkit';

const familySlice = createSlice({
  name: 'family',
  initialState: {
    families: []
  },
  reducers: {
    addFamily: (state, action) => {
      state.families.push(action.payload);
    },
    setFamilies: (state, action) => {
      state.families = action.payload;
    }
  }
});

export const { addFamily, setFamilies } = familySlice.actions;
export default familySlice.reducer;

