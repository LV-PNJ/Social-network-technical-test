import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
// import authReducer from '../features/authentication/authSlice'; // Removed import
import { userApiSlice } from '../features/authentication/services/userApiSlice';
import { postApiSlice } from '../features/posts/postApiSlice';

export const store = configureStore({
  reducer: {
    // auth: authReducer, // Removed auth reducer
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [postApiSlice.reducerPath]: postApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApiSlice.middleware)
      .concat(postApiSlice.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 