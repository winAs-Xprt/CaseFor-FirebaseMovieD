// src/redux/store.tsx
import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './movieSlice'; // Make sure this exists if you need it
import userReducer from './userSlice'; // Optional, only if you have user-related state

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    users: userReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
