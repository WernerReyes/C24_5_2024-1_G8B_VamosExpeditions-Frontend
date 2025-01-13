import type { HotelEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type HotelSliceState = {
  hotels: HotelEntity[];
  selectedHotel: HotelEntity | null;
};

const initialState: HotelSliceState = {
  hotels: [],
  selectedHotel: null,
};

export const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    onSetHotels: (state, { payload }: PayloadAction<HotelEntity[]>) => {
      return {
        ...state,
        hotels: payload,
      };
    },
    onSetSelectedHotel: (state, { payload }: PayloadAction<HotelEntity>) => {
      return {
        ...state,
        selectedHotel: payload,
      };
    },
  },
});

export const { onSetHotels, onSetSelectedHotel } = hotelSlice.actions;
