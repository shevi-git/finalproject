import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  families: [],
  loading: false,
  error: null
};

const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    addFamily: (state, action) => {
      state.families.push(action.payload);
    },
    setFamilies: (state, action) => {
      state.families = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { addFamily, setFamilies, setLoading, setError } = familySlice.actions;
export default familySlice.reducer; 