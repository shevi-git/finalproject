import { configureStore } from '@reduxjs/toolkit';
import familyReducer from './familySlice';
import userReducer from './UserSlice';
import announcementReducer from './AnnouncementSlice';

export const store = configureStore({
  reducer: {
    family: familyReducer,
    user: userReducer,
    announcement: announcementReducer
  }
});

export default store; 