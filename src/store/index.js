import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Can add other reducers here in the future
    // user: userReducer,
    // cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore serialization check for certain paths (if needed)
        ignoredActions: [],
      },
    }),
});

// TypeScript type definitions (can be used if migrating to TypeScript in the future)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

