import type { ServiceTripDetailsEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ServiceTripDetailsSliceState = {
  serviceTripDetails: ServiceTripDetailsEntity[];
  serviceTripDetailsWithTotalCost: (ServiceTripDetailsEntity & {
    totalCost: number;
    number?: number;
  })[];
  isFetchingServiceTripDetails: boolean;
};

const initialState: ServiceTripDetailsSliceState = {
  serviceTripDetails: [],
  serviceTripDetailsWithTotalCost: [],
  isFetchingServiceTripDetails: false,
};

export const serviceTripDetailsSlice = createSlice({
  name: "serviceTripDetails",
  initialState,
  reducers: {
    onSetServiceTripDetails: (
      state,
      { payload }: PayloadAction<ServiceTripDetailsEntity[]>
    ) => {
      return {
        ...state,
        serviceTripDetails: payload,
      };
    },

    onSetServiceTripDetailsWithTotalCost: (
      state,
      {
        payload,
      }: PayloadAction<(ServiceTripDetailsEntity & { totalCost: number, number?: number })[]>
    ) => {
      return {
        ...state,
        serviceTripDetailsWithTotalCost: payload,
      };
    },

    onFetchServiceTripDetails: (state, { payload }: PayloadAction<boolean>) => {
      return {
        ...state,
        isFetchingServiceTripDetails: payload,
      };
    },
  },
});

export const {
  onSetServiceTripDetails,
  onSetServiceTripDetailsWithTotalCost,
  onFetchServiceTripDetails,
} = serviceTripDetailsSlice.actions;
