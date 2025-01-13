import { configureStore } from "@reduxjs/toolkit";
import {
  authService,
  quoteService,
  externalCountryService,
  clientService,
  reservationService,
  accommodationRoomService,
  countryService,
  hotelService,
  
} from "@/infraestructure/store/services";

import {
  authSlice,
  quoteSlice,
  accommodationRoomSlice,
  accommodationQuoteSlice,
  quotationSlice,
  clientSlice,
  externalCountrySlice,
  countrySlice,
  cookieExpirationSlice,
  reservationSlice,
  hotelSlice,
  
} from "@/infraestructure/store";



export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    quote: quoteSlice.reducer,
    hotel: hotelSlice.reducer,
    accommodationRoom: accommodationRoomSlice.reducer,
    accommodationQuote: accommodationQuoteSlice.reducer,
    quotation: quotationSlice.reducer,
    client: clientSlice.reducer,
    externalCountry: externalCountrySlice.reducer,
    country: countrySlice.reducer,
    reservation: reservationSlice.reducer,
    cookieExpiration: cookieExpirationSlice.reducer,
    [quoteService.reducerPath]: quoteService.reducer,
    [authService.reducerPath]: authService.reducer,
    [countryService.reducerPath]: countryService.reducer,
    [clientService.reducerPath]: clientService.reducer,
    [hotelService.reducerPath]: hotelService.reducer,
    [reservationService.reducerPath]: reservationService.reducer,
    [externalCountryService.reducerPath]: externalCountryService.reducer,
    [accommodationRoomService.reducerPath]: accommodationRoomService.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(quoteService.middleware)
      .concat(authService.middleware)
      .concat(countryService.middleware)
      .concat(clientService.middleware)
      .concat(hotelService.middleware)
      .concat(reservationService.middleware)
      .concat(externalCountryService.middleware)
      .concat(accommodationRoomService.middleware),
      
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
