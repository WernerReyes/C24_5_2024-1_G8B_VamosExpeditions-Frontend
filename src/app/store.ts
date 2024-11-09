import { configureStore } from "@reduxjs/toolkit";
import { type AppState, authSlice } from "@/infraestructure/store";

export const store = configureStore<AppState>({
    reducer: {
      auth: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  