import { dateFnsAdapter } from "@/core/adapters";
import type { TripDetailsEntity } from "@/domain/entities";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TripDetailsSlice = {
  currentTripDetails: TripDetailsEntity | null;
  tripDetails: TripDetailsEntity[];
};

const initialState: TripDetailsSlice = {
  currentTripDetails: null,
  tripDetails: [],
};

export const tripDetailsSlice = createSlice({
  name: "tripDetails",
  initialState,
  reducers: {
    onSetCurrentTripDetails: (
      state,
      { payload }: PayloadAction<TripDetailsEntity | null>
    ) => {
      return {
        ...state,
        currentTripDetails: payload
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

    onSetSincronizedCurrentTripDetailsByClient: (
      state,
      { payload }: PayloadAction<TripDetailsEntity>
    ) => {
      return {
        ...state,
        currentTripDetails: {
          ...state.currentTripDetails,
          ...payload,
        },
        tripDetails: state.tripDetails.map((tripDetail) => {
          if (tripDetail.client?.id === payload.client?.id) {
            return {
              ...tripDetail,
              client: payload.client,
            };
          }

          return tripDetail;
        }),
      };
    },

    onSetTripDetails: (
      state,
      { payload }: PayloadAction<TripDetailsEntity[]>
    ) => {
      return {
        ...state,
        tripDetails: payload,
      };
    },
  },
});

export const {
  onSetCurrentTripDetails,
  onSetTripDetails,
  onSetSincronizedCurrentTripDetailsByClient,
} = tripDetailsSlice.actions;