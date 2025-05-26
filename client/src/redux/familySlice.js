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
    setFamilies: (state, action) => {
      state.families = action.payload;
    },
    addFamily: (state, action) => {
      state.families.push(action.payload);
    },
    updateFamily: (state, action) => {
      const index = state.families.findIndex(family => family._id === action.payload._id);
      if (index !== -1) {
        state.families[index] = action.payload;
      }
    },
    deleteFamily: (state, action) => {
      state.families = state.families.filter(family => family._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { 
  setFamilies, 
  addFamily, 
  updateFamily, 
  deleteFamily, 
  setLoading, 
  setError 
} = familySlice.actions;

export default familySlice.reducer; 