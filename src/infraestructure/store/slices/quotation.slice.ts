import { constantStorage } from "@/core/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const { ITINERARY_DAYS_NUMBER, ITINERARY_INITIAL_DATE } = constantStorage;

export type QuotationSliceState = {
  daysNumber: number;
  initialDate: Date | null;
};

const initialState: QuotationSliceState = {
  daysNumber: localStorage.getItem(ITINERARY_DAYS_NUMBER)
    ? parseInt(localStorage.getItem(ITINERARY_DAYS_NUMBER) as string)
    : 5,
  initialDate: localStorage.getItem(ITINERARY_INITIAL_DATE)
    ? new Date(localStorage.getItem(ITINERARY_INITIAL_DATE) as string)
    : null,
};

export const quotationSlice = createSlice({
  name: "quotation",
  initialState,
  reducers: {
    onSetDaysNumber: (state, { payload }: PayloadAction<number>) => {
      localStorage.setItem(ITINERARY_DAYS_NUMBER, payload.toString());
      return {
        ...state,
        daysNumber: payload,
      };
    },
    onSetInitialDate: (state, { payload }: PayloadAction<Date>) => {
      localStorage.setItem(ITINERARY_INITIAL_DATE, payload.toISOString());
      return {
        ...state,
        initialDate: payload,
      };
    },
  },
});

export const { onSetDaysNumber, onSetInitialDate } = quotationSlice.actions;
