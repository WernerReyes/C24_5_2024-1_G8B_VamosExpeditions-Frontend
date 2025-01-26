import type { HotelRoomQuotationEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type HotelRoomQuotationSliceState = {
  hotelRoomQuotations: HotelRoomQuotationEntity[];
};

const initialState: HotelRoomQuotationSliceState = {
  hotelRoomQuotations: [],
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
  onDeleteHotelRoomQuotation,
} = hotelRoomQuotationSlice.actions;
