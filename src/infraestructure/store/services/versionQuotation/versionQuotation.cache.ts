import type { AppDispatch, AppState } from "@/app/store";
import type {
  ClientEntity,
  HotelRoomTripDetailsEntity,
  TripDetailsEntity,
  UserEntity,
  VersionQuotationEntity,
} from "@/domain/entities";
import {
  addMultipleHotelRoomTripDetails,
  deleteManyHotelRoomTripDetails,
  updateByClient,
  updateByTripDetails,
  updateByUser,
  updateByUserId,
  updateFromAnotherService,
  updateManyHotelRoomTripDetailsByDate,
} from "./cache/external";
import {
  archive,
  cancelAndReplaceApprovedOfficial,
  duplicateMultiple,
  unArchive,
  update,
  updateOfficial,
} from "./cache/update";
import type {
  CancelAndReplaceApprovedOfficialVersionQuotation,
  UnArchiveVersionQuotation,
  UpdateOfficialVersionQuotation,
} from "./versionQuotation.response";

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
    data: VersionQuotationEntity[],
    dispatch: AppDispatch,
    getState: () => AppState
  ) => duplicateMultiple(data, dispatch, getState),

  archive: (
    data: VersionQuotationEntity,
    dispatch: AppDispatch,
    getState: () => AppState
  ) => archive(data, dispatch, getState),

  unArchive: (
    data: UnArchiveVersionQuotation,
    dispatch: AppDispatch,
    getState: () => AppState
  ) => unArchive(data, dispatch, getState),
};
