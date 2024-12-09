import type { AccommodationRoomEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AccommodationRoomSliceState = {
  accommodationRooms: AccommodationRoomEntity[];
  selectedAccommodationRoom: AccommodationRoomEntity | null;
};

const initialState: AccommodationRoomSliceState = {
  accommodationRooms: [],
  selectedAccommodationRoom: null,
};

export const accommodationRoomSlice = createSlice({
  name: "accommodation-room",
  initialState,
  reducers: {
    onSetAccommodationRooms: (
      state,
      { payload }: PayloadAction<AccommodationRoomEntity[]>
    ) => {
      return {
        ...state,
        accommodationRooms: payload,
      };
    },
    onSetSelectedAccommodationRoom: (
      state,
      { payload }: PayloadAction<AccommodationRoomEntity>
    ) => {
      return {
        ...state,
        selectedAccommodationRoom: payload,
      };
    },
  },
});

export const { onSetAccommodationRooms, onSetSelectedAccommodationRoom } =
  accommodationRoomSlice.actions;
