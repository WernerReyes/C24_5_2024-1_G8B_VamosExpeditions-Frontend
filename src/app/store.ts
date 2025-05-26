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
  roleService,
  distritService,
  notificationService,
  roomService,
  cityService,
  settingService,
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
    [roleService.reducerPath]: roleService.reducer,
    [userService.reducerPath]: userService.reducer,
    [clientService.reducerPath]: clientService.reducer,
    [quotationServiceStore.reducerPath]: quotationServiceStore.reducer,
    [versionQuotationService.reducerPath]: versionQuotationService.reducer,
    [hotelRoomTripDetailsService.reducerPath]:
      hotelRoomTripDetailsService.reducer,
    [reservationServiceStore.reducerPath]: reservationServiceStore.reducer,
    [externalCountryService.reducerPath]: externalCountryService.reducer,
    [SocketService.reducerPath]: SocketService.reducer,
    [distritService.reducerPath]: distritService.reducer,
    [cityService.reducerPath]: cityService.reducer,
    [countryService.reducerPath]: countryService.reducer,
    [notificationService.reducerPath]: notificationService.reducer,
    [hotelService.reducerPath]: hotelService.reducer,
    [roomService.reducerPath]: roomService.reducer,
    [settingService.reducerPath]: settingService.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authService.middleware)
      .concat(roleService.middleware)
      .concat(userService.middleware)
      .concat(clientService.middleware)
      .concat(reservationServiceStore.middleware)
      .concat(tripDetailsServiceStore.middleware)
      .concat(quotationServiceStore.middleware)
      .concat(versionQuotationService.middleware)
      .concat(hotelRoomTripDetailsService.middleware)
      .concat(externalCountryService.middleware)
      .concat(SocketService.middleware)

      .concat(distritService.middleware)
      .concat(cityService.middleware)
      .concat(countryService.middleware)

      .concat(notificationService.middleware)
      .concat(rtkQueryErrorLogger)

      // apis hotel and room
      .concat(hotelService.middleware)
      .concat(roomService.middleware)
      .concat(settingService.middleware)
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
