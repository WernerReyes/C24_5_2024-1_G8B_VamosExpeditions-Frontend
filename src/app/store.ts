import { configureStore } from "@reduxjs/toolkit";
import {
  authService,
  quoteService,
  externalCountryService,
  clientService,
  reservationService,
} from "@/infraestructure/store/services";
import {
  authSlice,
  quoteSlice,
  accommodationRoomSlice,
  accommodationQuoteSlice,
  quotationSlice,
  clientSlice,
  externalCountrySlice,
  nationSlice,
  cookieExpirationSlice,
  reservationSlice,
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
    reservation: reservationSlice.reducer,
    cookieExpiration: cookieExpirationSlice.reducer,
    [quoteService.reducerPath]: quoteService.reducer,
    [authService.reducerPath]: authService.reducer,
    [clientService.reducerPath]: clientService.reducer,
    [reservationService.reducerPath]: reservationService.reducer,
    [externalCountryService.reducerPath]: externalCountryService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(quoteService.middleware)
      .concat(authService.middleware)
      .concat(clientService.middleware)
      .concat(reservationService.middleware)
      .concat(externalCountryService.middleware)
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
