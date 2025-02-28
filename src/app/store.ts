import { configureStore } from "@reduxjs/toolkit";
import {
  authService,
  externalCountryService,
  clientService,
  countryService,
  hotelService,
  quotationServiceStore,
  versionQuotationService,
  hotelRoomTripDetailsService,
  reservationServiceStore,
  reportService,
  tripDetailsServiceStore,
  userService,
} from "@/infraestructure/store/services";

import {
  authSlice,
  quotationSlice,
  clientSlice,
  countrySlice,
  cookieExpirationSlice,
  reservationSlice,
  hotelSlice,
  versionquotationSlice,
  hotelRoomTripDetailsSlice,
  tripDetailsSlice,
} from "@/infraestructure/store";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    hotel: hotelSlice.reducer,
    quotation: quotationSlice.reducer,
    versionQuotation: versionquotationSlice.reducer,
    hotelRoomTripDetails: hotelRoomTripDetailsSlice.reducer,
    client: clientSlice.reducer,
    country: countrySlice.reducer,
    reservation: reservationSlice.reducer,
    tripDetails: tripDetailsSlice.reducer,
    cookieExpiration: cookieExpirationSlice.reducer,
    [tripDetailsServiceStore.reducerPath]: tripDetailsServiceStore.reducer,
    [authService.reducerPath]: authService.reducer,
    [userService.reducerPath]: userService.reducer,
    [countryService.reducerPath]: countryService.reducer,
    [clientService.reducerPath]: clientService.reducer,
    [hotelService.reducerPath]: hotelService.reducer,
    [quotationServiceStore.reducerPath]: quotationServiceStore.reducer,
    [versionQuotationService.reducerPath]: versionQuotationService.reducer,
    [hotelRoomTripDetailsService.reducerPath]: hotelRoomTripDetailsService.reducer,
    [reservationServiceStore.reducerPath]: reservationServiceStore.reducer,
    [externalCountryService.reducerPath]: externalCountryService.reducer,
    [reportService.reducerPath]: reportService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authService.middleware)
      .concat(userService.middleware)
      .concat(countryService.middleware)
      .concat(clientService.middleware)
      .concat(hotelService.middleware)
      .concat(reservationServiceStore.middleware)
      .concat(tripDetailsServiceStore.middleware)
      .concat(quotationServiceStore.middleware)
      .concat(versionQuotationService.middleware)
      .concat(hotelRoomTripDetailsService.middleware)
      .concat(externalCountryService.middleware)
      .concat(reportService.middleware),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
