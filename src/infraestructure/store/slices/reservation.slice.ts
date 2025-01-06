// import { CountryEntity } from "@/domain/entities";
import { dateFnsAdapter } from "@/core/adapters";
import type { ReservationEntity } from "@/domain/entities";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ReservationSlice = {
  currentReservation: ReservationEntity | null;
  reservationsByStatus: ReservationEntity[];
};

const initialState: ReservationSlice = {
  currentReservation: null,
  reservationsByStatus: [],
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
              startDate: dateFnsAdapter.parseISO(payload.startDate as any),
              endDate: dateFnsAdapter.parseISO(payload.endDate as any),
            }
          : null,
      };
    },

    onSetReservationsByStatus: (
      state,
      { payload }: PayloadAction<ReservationEntity[]>
    ) => {
      return {
        ...state,
        reservationsByStatus: payload,
      };
    }
  },
});

export const { onSetCurrentReservation, onSetReservationsByStatus } = reservationSlice.actions;
