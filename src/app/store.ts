import { configureStore } from "@reduxjs/toolkit";

import {
  type AppState,
  authSlice,
  quoteSlice,
  accommodationRoomSlice,
  accommodationQuoteSlice,
  quotationSlice,
  clientSlice,
} from "@/infraestructure/store";

export const store = configureStore<AppState>({
  reducer: {
    auth: authSlice.reducer,
    quote: quoteSlice.reducer,
    accommodationRoom: accommodationRoomSlice.reducer,
    accommodationQuote: accommodationQuoteSlice.reducer,
    quotation: quotationSlice.reducer,
    client: clientSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});



