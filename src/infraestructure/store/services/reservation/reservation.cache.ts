import type { AppState } from "@/app/store";
import { extractParams } from "@/core/utils";
import { GetReservationsDto } from "@/domain/dtos/reservation";
import type {
  ReservationEntity,
  UserEntity,
  VersionQuotationEntity,
} from "@/domain/entities";
import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { reservationServiceStore } from "./reservation.service";
import { RootState } from "@reduxjs/toolkit/query";

type Reservation = typeof reservationServiceStore.reducerPath;

export const reservationCache = {
  updateReservationFromAnotherService: (
    data: VersionQuotationEntity,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => AppState
  ) => {
    const cachedQueries = (getState() as AppState).reservationServiceStore
      .queries;
    const extractedParams = extractParams<
      {
        getAllReservations: GetReservationsDto;
      }[]
    >(cachedQueries);
    for (const query of extractedParams) {
      if (query.getAllReservations) {
        dispatch(
          reservationServiceStore.util.updateQueryData(
            "getAllReservations",
            query.getAllReservations,
            (draft) => {
              Object.assign(draft, {
                data: {
                  ...draft.data,
                  content: draft.data.content.map((reservation) => {
                    return {
                      ...reservation,
                      versionQuotation:
                        reservation?.versionQuotation?.id?.quotationId ===
                        data.id.quotationId
                          ? data
                          : reservation.versionQuotation,
                    };
                  }),
                },
              });
            }
          )
        );
      }
    }
  },

  updateReservationByUser: (
    data: Partial<UserEntity>,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => AppState
  ) => {
    const cachedQueries = (getState() as AppState).reservationServiceStore
      .queries;
    const extractedParams = extractParams<
      {
        getAllReservations: GetReservationsDto;
        getTrashReservations: GetReservationsDto;
      }[]
    >(cachedQueries);
    for (const query of extractedParams) {
      const { getAllReservations, getTrashReservations } = query;
      if (getAllReservations) {
        dispatch(
          reservationServiceStore.util.updateQueryData(
            "getAllReservations",
            getAllReservations,
            (draft) => {
              Object.assign(draft, {
                data: {
                  ...draft.data,
                  content: draft.data.content.map((reservation) => {
                    if (reservation?.versionQuotation?.user?.id === data.id) {
                      return {
                        ...reservation,
                        versionQuotation: {
                          ...reservation.versionQuotation,
                          user: {
                            ...reservation.versionQuotation.user,
                            ...data,
                          },
                        },
                      };
                    }

                    return reservation;
                  }),
                },
              });
            }
          )
        );
      }

      if (getTrashReservations) {
        dispatch(
          reservationServiceStore.util.updateQueryData(
            "getTrashReservations",
            getTrashReservations,
            (draft) => {
              Object.assign(draft, {
                data: {
                  ...draft.data,
                  content: draft.data.content.map((reservation) => {
                    if (reservation?.versionQuotation?.user?.id === data.id) {
                      return {
                        ...reservation,
                        versionQuotation: {
                          ...reservation.versionQuotation,
                          user: {
                            ...reservation.versionQuotation.user,
                            ...data,
                          },
                        },
                      };
                    }
                  }),
                },
              });
            }
          )
        );
      }
    }
  },

  upsertReservation: (
    data: ReservationEntity,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, Reservation>
  ) => {
    const args = reservationServiceStore.util.selectCachedArgsForQuery(
      getState(),
      "getAllReservations"
    );
    for (const query of args) {
      dispatch(
        reservationServiceStore.util.updateQueryData(
          "getAllReservations",
          query,
          (draft) => {
            const exists = draft.data.content.some(
              (reservation) => reservation.id === data.id
            );
            Object.assign(draft, {
              data: {
                ...draft.data,
                content: !exists
                  ? [...draft.data.content, data]
                  : draft.data.content.map((reservation) =>
                      reservation.id === data.id ? data : reservation
                    ),
              },
            });
          }
        )
      );
    }
  },

  trashReservation: (
    data: ReservationEntity,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, Reservation>
  ) => {
    const cachedQueries = (getState() as AppState).reservationServiceStore
      .queries;
    const extractedParams = extractParams<
      {
        getAllReservations: GetReservationsDto;
        getTrashReservations: GetReservationsDto;
      }[]
    >(cachedQueries);
    for (const query of extractedParams) {
      const { getAllReservations, getTrashReservations } = query;
      if (getAllReservations) {
        dispatch(
          reservationServiceStore.util.updateQueryData(
            "getAllReservations",
            getAllReservations,
            (draft) => {
              Object.assign(draft, {
                data: {
                  ...draft.data,
                  content: draft.data.content.filter(
                    (reservation) => reservation.id !== data.id
                  ),
                  total: draft.data.total - 1,
                },
              });
            }
          )
        );
      }

      if (getTrashReservations) {
        dispatch(
          reservationServiceStore.util.updateQueryData(
            "getTrashReservations",
            getTrashReservations,
            (draft) => {
              Object.assign(draft, {
                data: {
                  ...draft.data,
                  content: [...draft.data.content, data],
                  total: draft.data.total + 1,
                },
              });
            }
          )
        );
      }
    }
  },

  restoreReservation: (
    data: ReservationEntity,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, Reservation>
  ) => {
    const cachedQueries = (getState() as AppState).reservationServiceStore
      .queries;
    const extractedParams = extractParams<
      {
        getAllReservations: GetReservationsDto;
        getTrashReservations: GetReservationsDto;
      }[]
    >(cachedQueries);
    for (const query of extractedParams) {
      const { getAllReservations, getTrashReservations } = query;
      if (getAllReservations) {
        dispatch(
          reservationServiceStore.util.updateQueryData(
            "getAllReservations",
            getAllReservations,
            (draft) => {
              Object.assign(draft, {
                data: {
                  ...draft.data,
                  content: [...draft.data.content, data],
                  total: draft.data.total + 1,
                },
              });
            }
          )
        );
      }

      if (getTrashReservations) {
        dispatch(
          reservationServiceStore.util.updateQueryData(
            "getTrashReservations",
            getTrashReservations,
            (draft) => {
              Object.assign(draft, {
                data: {
                  ...draft.data,
                  content: draft.data.content.filter(
                    (reservation) => reservation.id !== data.id
                  ),
                  total: draft.data.total - 1,
                },
              });
            }
          )
        );
      }
    }
  },
};
