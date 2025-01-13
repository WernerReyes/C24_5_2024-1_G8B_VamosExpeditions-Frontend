// import { CountryEntity } from "@/domain/entities";
import { dateFnsAdapter } from "@/core/adapters";
import type { ReservationEntity } from "@/domain/entities";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ReservationSlice = {
  currentReservation: ReservationEntity | null;
  reservations: ReservationEntity[];
};

const initialState: ReservationSlice = {
  currentReservation: null,
  reservations: [],
};

export const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    onSetCurrentReservation: (
      state,
      { payload }: PayloadAction<ReservationEntity | null>
    ) => {
      return {
        ...state,
        currentReservation: payload
          ? {
              ...payload,
              startDate:
                typeof payload.startDate === "string"
                  ? dateFnsAdapter.parseISO(payload.startDate)
                  : payload.startDate,
              endDate:
                typeof payload.endDate === "string"
                  ? dateFnsAdapter.parseISO(payload.endDate)
                  : payload.endDate,
            }
          : null,
      };
    },

    onSetSincronizedCurrentReservationByClient: (
      state,
      { payload }: PayloadAction<ReservationEntity>
    ) => {
      return {
        ...state,
        currentReservation: {
          ...state.currentReservation,
          ...payload,
        },
        reservations: state.reservations.map((reservation) => {
          if (reservation.client?.id === payload.client?.id) {
            return {
              ...reservation,
              client: payload.client,
            };
          }

          return reservation;
        }),
      };
    },

    onSetReservations: (
      state,
      { payload }: PayloadAction<ReservationEntity[]>
    ) => {
      return {
        ...state,
        reservations: payload,
      };
    },
  },
});

export const {
  onSetCurrentReservation,
  onSetReservations,
  onSetSincronizedCurrentReservationByClient,
} = reservationSlice.actions;
