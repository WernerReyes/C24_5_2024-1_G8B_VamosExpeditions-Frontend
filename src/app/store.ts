import { configureStore } from "@reduxjs/toolkit";
import {
  authService,
  quoteService,
  externalCountryService,
  clientService,
  countryService,
  hotelService,
  quotationServiceStore,
  versionQuotationService,
  hotelRoomQuotationService,
  reservationServiceStore,
} from "@/infraestructure/store/services";

import {
  authSlice,
  quoteSlice,
  quotationSlice,
  clientSlice,
  externalCountrySlice,
  countrySlice,
  cookieExpirationSlice,
  reservationSlice,
  hotelSlice,
  versionquotationSlice,
  hotelRoomQuotationSlice,

} from "@/infraestructure/store";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    quote: quoteSlice.reducer,
    hotel: hotelSlice.reducer,
    quotation: quotationSlice.reducer,
    versionQuotation: versionquotationSlice.reducer,
    hotelRoomQuotation: hotelRoomQuotationSlice.reducer,
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
    [quotationServiceStore.reducerPath]: quotationServiceStore.reducer,
    [versionQuotationService.reducerPath]: versionQuotationService.reducer,
    [hotelRoomQuotationService.reducerPath]: hotelRoomQuotationService.reducer,
    [reservationServiceStore.reducerPath]: reservationServiceStore.reducer,
    [externalCountryService.reducerPath]: externalCountryService.reducer,
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
      .concat(reservationServiceStore.middleware)
      .concat(quotationServiceStore.middleware)
      .concat(versionQuotationService.middleware)
      .concat(hotelRoomQuotationService.middleware)
      .concat(externalCountryService.middleware),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
