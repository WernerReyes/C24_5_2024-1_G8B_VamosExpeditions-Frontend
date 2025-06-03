import type { AppDispatch, AppState } from "@/app/store";
import type {
  ClientEntity,
  HotelRoomTripDetailsEntity,
  ReservationEntity,
  ServiceTripDetailsEntity,
  TripDetailsEntity,
  UserEntity,
  VersionQuotationEntity,
} from "@/domain/entities";
import {
  addMultipleHotelRoomTripDetails,
  deleteManyHotelRoomTripDetails,
  updateByClient,
  updateByReservation,
  updateByTripDetails,
  updateByUser,
  updateByUserId,
  updateFromAnotherService,
  updateManyHotelRoomTripDetailsByDate,
} from "./cache/external";
import {
  trash,
  cancelAndReplaceApprovedOfficial,
  duplicateMultiple,
  restore,
  update,
  updateOfficial,
} from "./cache/update";
import type {
  CancelAndReplaceApprovedOfficialVersionQuotation,
  RestoreVersionQuotation,
  UpdateOfficialVersionQuotation,
} from "./versionQuotation.response";
import { addMultipleServiceTripDetails, deleteManyServicesTripDetails, updateManyServicesTripDetailsByDate } from "./cache/external/updateByServiceTripDetails";

export const versionQuotationCache = {
  updateFromAnotherService: (
    data: VersionQuotationEntity,
    dispatch: AppDispatch,
    getState: () => AppState
  ) => updateFromAnotherService(data, dispatch, getState),

  //* User
  updateByUser: (
    data: UserEntity,
    dispatch: AppDispatch,
    getState: () => AppState
  ) => updateByUser(data, dispatch, getState),

  updateByUserId: (
    id: UserEntity["id"],
    online: boolean,
    dispatch: AppDispatch,
    getState: () => AppState
  ) => updateByUserId(id, online, dispatch, getState),

  //* TripDetails
  updateByTripDetails: (
    data: TripDetailsEntity,
    dispatch: AppDispatch,
    getState: () => AppState
  ) => updateByTripDetails(data, dispatch, getState),

  //* Client
  updateByClient: (
    data: ClientEntity,
    dispatch: AppDispatch,
    getState: () => AppState
  ) => updateByClient(data, dispatch, getState),

  //* HotelRoomTripDetails
  addMultipleHotelRoomTripDetails: (
    data: HotelRoomTripDetailsEntity[],
    dispatch: AppDispatch,
    getState: () => AppState
  ) => addMultipleHotelRoomTripDetails(data, dispatch, getState),

  updateManyHotelRoomTripDetailsByDate: (
    data: HotelRoomTripDetailsEntity[],
    dispatch: AppDispatch,
    getState: () => AppState
  ) => updateManyHotelRoomTripDetailsByDate(data, dispatch, getState),

  deleteManyHotelRoomTripDetails: (
    data: HotelRoomTripDetailsEntity[],
    dispatch: AppDispatch,
    getState: () => AppState
  ) => deleteManyHotelRoomTripDetails(data, dispatch, getState),

  deleteHotelRoomTripDetails: (
    data: HotelRoomTripDetailsEntity,
    dispatch: AppDispatch,
    getState: () => AppState
  ) => deleteManyHotelRoomTripDetails([data], dispatch, getState),

  //* ServiceTripDetails
  addMultipleServiceTripDetails: (
    data: ServiceTripDetailsEntity[],
    dispatch: AppDispatch,
    getState: () => AppState
  ) => addMultipleServiceTripDetails(data, dispatch, getState),

  updateManyServicesTripDetailsByDate: (
    data: ServiceTripDetailsEntity[],
    dispatch: AppDispatch,
    getState: () => AppState
  ) => updateManyServicesTripDetailsByDate(data, dispatch, getState),

  deleteManyServicesTripDetails: (
    data: ServiceTripDetailsEntity["id"][],
    dispatch: AppDispatch,
    getState: () => AppState
  ) => deleteManyServicesTripDetails(data, dispatch, getState),

  //* Reservation
  updateByReservation: (
    data: Partial<ReservationEntity>,
    dispatch: AppDispatch,
    getState: () => AppState
  ) => updateByReservation(data, dispatch, getState),

  //* VersionQuotation

  update: (
    data: VersionQuotationEntity,
    dispatch: AppDispatch,
    getState: () => AppState
  ) => update(data, dispatch, getState),

  updateOfficial: (
    data: UpdateOfficialVersionQuotation,
    dispatch: AppDispatch,
    getState: () => AppState
  ) => updateOfficial(data, dispatch, getState),

  cancelAndReplaceApprovedOfficial: (
    data: CancelAndReplaceApprovedOfficialVersionQuotation,
    dispatch: AppDispatch,
    getState: () => AppState
  ) => cancelAndReplaceApprovedOfficial(data, dispatch, getState),

  duplicateMultiple: (
    // ids: VersionQuotationEntity["id"][],
    data: VersionQuotationEntity[],
    dispatch: AppDispatch,
    getState: () => AppState
  ) => duplicateMultiple(data, dispatch, getState),

  trash: (
    data: VersionQuotationEntity,
    dispatch: AppDispatch,
    getState: () => AppState
  ) => trash(data, dispatch, getState),

  restore: (
    data: RestoreVersionQuotation,
    dispatch: AppDispatch,
    getState: () => AppState
  ) => restore(data, dispatch, getState),
};
