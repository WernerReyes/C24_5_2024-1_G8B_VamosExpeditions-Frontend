import { configureStore } from "@reduxjs/toolkit";
import { authService, quoteService } from "@/infraestructure/store/services";
import {
  authSlice,
  quoteSlice,
  accommodationRoomSlice,
  accommodationQuoteSlice,
  quotationSlice,
  clientSlice,
  externalCountrySlice,
  nationSlice,
} from "@/infraestructure/store";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    quote: quoteSlice.reducer,
    accommodationRoom: accommodationRoomSlice.reducer,
    accommodationQuote: accommodationQuoteSlice.reducer,
    quotation: quotationSlice.reducer,
    client: clientSlice.reducer,
    externalCountry: externalCountrySlice.reducer,
    nation: nationSlice.reducer,
    [quoteService.reducerPath]: quoteService.reducer,
    [authService.reducerPath]: authService.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(quoteService.middleware).concat(authService.middleware),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;