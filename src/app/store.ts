import { configureStore } from "@reduxjs/toolkit";
import { type AppState, authSlice, quoteSlice } from "@/infraestructure/store";

export const store = configureStore<AppState>({
    reducer: {
      auth: authSlice.reducer,
      quote: quoteSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  