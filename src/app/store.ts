import { configureStore } from "@reduxjs/toolkit";
import { type AppState, authSlice, quoteSlice,clientSlice } from "@/infraestructure/store";

export const store = configureStore<AppState>({
    reducer: {
      auth: authSlice.reducer,
      quote: quoteSlice.reducer,
      client: clientSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  