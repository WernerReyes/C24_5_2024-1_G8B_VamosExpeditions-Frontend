import type { HotelRoomQuotationEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DeleteDirection = "middle" | "start" | "end" | undefined;

type HotelRoomQuotationSliceState = {
  hotelRoomQuotations: HotelRoomQuotationEntity[];
  hotelRoomQuotationsWithTotalCost: (HotelRoomQuotationEntity & {
    totalCost: number;
  })[];
  deleteDirection: DeleteDirection;
};

const initialState: HotelRoomQuotationSliceState = {
  hotelRoomQuotations: [],
  hotelRoomQuotationsWithTotalCost: [],
  deleteDirection: undefined,
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

    onDeleteDirection: (state, { payload }: PayloadAction<DeleteDirection>) => {
      return {
        ...state,
        deleteDirection: payload,
      };
    },
  },
});

export const {
  onSetHotelRoomQuotations,
  onSetHotelRoomQuotationsWithTotalCost,
  onDeleteDirection,
} = hotelRoomQuotationSlice.actions;
