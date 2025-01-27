import type { HotelRoomQuotationEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type HotelRoomQuotationSliceState = {
  hotelRoomQuotations: HotelRoomQuotationEntity[];
  hotelRoomQuotationsWithTotalCost: (HotelRoomQuotationEntity & {
    totalCost: number;
  })[];
};

const initialState: HotelRoomQuotationSliceState = {
  hotelRoomQuotations: [],
  hotelRoomQuotationsWithTotalCost: [],
};

export const hotelRoomQuotationSlice = createSlice({
  name: "hotelRoomQuotation",
  initialState,
  reducers: {
    onAddHotelRoomQuotation: (
      state,
      { payload }: PayloadAction<HotelRoomQuotationEntity | null>
    ) => {
      return {
        ...state,
        hotelRoomQuotations: payload
          ? [...state.hotelRoomQuotations, payload]
          : [],
      };
    },

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

    onDeleteHotelRoomQuotation: (state, { payload }: PayloadAction<number>) => {
      return {
        ...state,
        hotelRoomQuotations: state.hotelRoomQuotations.filter(
          (hotelRoomQuotation) => hotelRoomQuotation.id !== payload
        ),
      };
    },
  },
});

export const {
  onAddHotelRoomQuotation,
  onSetHotelRoomQuotations,
  onSetHotelRoomQuotationsWithTotalCost,
  onDeleteHotelRoomQuotation,
} = hotelRoomQuotationSlice.actions;
