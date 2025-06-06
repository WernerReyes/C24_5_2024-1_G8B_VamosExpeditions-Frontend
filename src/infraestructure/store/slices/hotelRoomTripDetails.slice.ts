import type { HotelRoomTripDetailsEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type HotelRoomTripDetailsSliceState = {
  hotelRoomTripDetails: HotelRoomTripDetailsEntity[];
  hotelRoomTripDetailsWithTotalCost: (Partial<HotelRoomTripDetailsEntity> & {
    totalCost: number;
    number?: number;
  })[];
  isFetchingHotelRoomTripDetails: boolean;
};

const initialState: HotelRoomTripDetailsSliceState = {
  hotelRoomTripDetails: [],
  hotelRoomTripDetailsWithTotalCost: [],
  isFetchingHotelRoomTripDetails: false,
};

export const hotelRoomTripDetailsSlice = createSlice({
  name: "hotelRoomTripDetails",
  initialState,
  reducers: {
    onSetHotelRoomTripDetails: (
      state,
      { payload }: PayloadAction<HotelRoomTripDetailsEntity[]>
    ) => {
      return {
        ...state,
        hotelRoomTripDetails: payload,
      };
    },

    onSetHotelRoomTripDetailsWithTotalCost: (
      state,
      {
        payload,
      }: PayloadAction<(Partial<HotelRoomTripDetailsEntity> & { totalCost: number, number?: number })[]>
    ) => {
      return {
        ...state,
        hotelRoomTripDetailsWithTotalCost: payload,
      };
    },

    onFetchHotelRoomTripDetails: (state, { payload }: PayloadAction<boolean>) => {
      return {
        ...state,
        isFetchingHotelRoomTripDetails: payload,
      };
    },
  },
});

export const {
  onSetHotelRoomTripDetails,
  onSetHotelRoomTripDetailsWithTotalCost,
  onFetchHotelRoomTripDetails,
} = hotelRoomTripDetailsSlice.actions;