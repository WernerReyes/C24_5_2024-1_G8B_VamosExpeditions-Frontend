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
   
    onSetSelectedHotel: (state, { payload }: PayloadAction<HotelEntity>) => {
      return {
        ...state,
        selectedHotel: payload,
      };
    },
  },
});

export const {  onSetSelectedHotel } = hotelSlice.actions;
