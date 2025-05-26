import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  announcements: [],
  loading: false,
  error: null
};

const announcementSlice = createSlice({
  name: 'announcement',
  initialState,
  reducers: {
    setAnnouncements: (state, action) => {
      state.announcements = action.payload;
    },
    addAnnouncement: (state, action) => {
      state.announcements.push(action.payload);
    },
    updateAnnouncement: (state, action) => {
      const index = state.announcements.findIndex(announcement => announcement._id === action.payload._id);
      if (index !== -1) {
        state.announcements[index] = action.payload;
      }
    },
    deleteAnnouncement: (state, action) => {
      state.announcements = state.announcements.filter(announcement => announcement._id !== action.payload);
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
  setAnnouncements,
  addAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  setLoading,
  setError
} = announcementSlice.actions;

export default announcementSlice.reducer;