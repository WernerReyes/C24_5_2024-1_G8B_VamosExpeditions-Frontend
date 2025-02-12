import type { HotelRoomQuotationEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



type HotelRoomQuotationSliceState = {
  hotelRoomQuotations: HotelRoomQuotationEntity[];
  hotelRoomQuotationsWithTotalCost: (HotelRoomQuotationEntity & {
    totalCost: number;
  })[];
  isFetchingHotelRoomQuotations: boolean;
};

const initialState: HotelRoomQuotationSliceState = {
  hotelRoomQuotations: [],
  hotelRoomQuotationsWithTotalCost: [],
  isFetchingHotelRoomQuotations: false,
};

export const hotelRoomQuotationSlice = createSlice({
  name: "hotelRoomQuotation",
  initialState,
  reducers: {
    onSetHotelRoomQuotations: (
      state,
      { payload }: PayloadAction<HotelRoomQuotationEntity[]>
    ) => {
      return {
        ...state,
        hotelRoomQuotations: payload,
      };
    },

    onSetHotelRoomQuotationsWithTotalCost: (
      state,
      {
        payload,
      }: PayloadAction<(HotelRoomQuotationEntity & { totalCost: number })[]>
    ) => {
      return {
        ...state,
        hotelRoomQuotationsWithTotalCost: payload,
      };
    },

    onFetchHotelRoomQuotations: (state, { payload }: PayloadAction<boolean>) => {
      return {
        ...state,
        isFetchingHotelRoomQuotations: payload,
      };
    },
  },
});

export const {
  onSetHotelRoomQuotations,
  onSetHotelRoomQuotationsWithTotalCost,
  onFetchHotelRoomQuotations,
} = hotelRoomQuotationSlice.actions;
