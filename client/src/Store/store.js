import { configureStore } from '@reduxjs/toolkit';
import familyReducer from './familySlice';

export const store = configureStore({
  reducer: {
    family: familyReducer
  }
}); 