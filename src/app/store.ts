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
  tripDetailsServiceStore,
  userService,
  rtkQueryErrorLogger,
  SocketService,
<<<<<<< HEAD
  EmailService,
  distritService,
=======
  notificationService,
>>>>>>> 53147d4b7dc5598ee724249add289ed54404fab2
} from "@/infraestructure/store/services";

import {
  sidebarSlice,
  authSlice,
  quotationSlice,
  clientSlice,
  countrySlice,
  cookieExpirationSlice,
  hotelSlice,
  versionquotationSlice,
  hotelRoomTripDetailsSlice,
  tripDetailsSlice,
  usersSlice,
  userNotificationSlice,
} from "@/infraestructure/store";

export const store = configureStore({
  reducer: {
    sidebar: sidebarSlice.reducer,
    auth: authSlice.reducer,
    hotel: hotelSlice.reducer,
    quotation: quotationSlice.reducer,
    versionQuotation: versionquotationSlice.reducer,
    hotelRoomTripDetails: hotelRoomTripDetailsSlice.reducer,
    client: clientSlice.reducer,
    country: countrySlice.reducer,
    tripDetails: tripDetailsSlice.reducer,
    cookieExpiration: cookieExpirationSlice.reducer,

    chatNotifications: userNotificationSlice.reducer,
    users: usersSlice.reducer,
    [tripDetailsServiceStore.reducerPath]: tripDetailsServiceStore.reducer,
    [authService.reducerPath]: authService.reducer,
    [userService.reducerPath]: userService.reducer,
    [countryService.reducerPath]: countryService.reducer,
    [clientService.reducerPath]: clientService.reducer,
    [hotelService.reducerPath]: hotelService.reducer,
    [quotationServiceStore.reducerPath]: quotationServiceStore.reducer,
    [versionQuotationService.reducerPath]: versionQuotationService.reducer,
    [hotelRoomTripDetailsService.reducerPath]:
      hotelRoomTripDetailsService.reducer,
    [reservationServiceStore.reducerPath]: reservationServiceStore.reducer,
    [externalCountryService.reducerPath]: externalCountryService.reducer,
    [SocketService.reducerPath]: SocketService.reducer,
<<<<<<< HEAD
    [EmailService.reducerPath]: EmailService.reducer,
    [distritService.reducerPath]: distritService.reducer,
=======
    [notificationService.reducerPath]: notificationService.reducer,
>>>>>>> 53147d4b7dc5598ee724249add289ed54404fab2
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
      .concat(SocketService.middleware)
<<<<<<< HEAD
      .concat(EmailService.middleware)
      .concat(distritService.middleware)
=======
      .concat(notificationService.middleware)
>>>>>>> 53147d4b7dc5598ee724249add289ed54404fab2
      .concat(rtkQueryErrorLogger),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
