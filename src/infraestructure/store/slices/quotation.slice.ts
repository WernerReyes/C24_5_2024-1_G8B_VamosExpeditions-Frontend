import { constantStorage } from "@/core/constants";
import { LocalQuotationEntity } from "@/data";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const { CURRENT_ACTIVE_STEP, ITINERARY_CURRENT_SELECTED_DAY } = constantStorage;

export interface Day {
  id: number;
  number: number;
  name: string;
  date: Date;
  formattedDate: string;
  total: number;
}

type QuotationSliceState = {
  currentQuotation: LocalQuotationEntity | null;
  currentStep: number;
  days: Day[];
  selectedDay: Day | null;
  operationType: "create" | "edit" | "replace" | null;
};

const initialState: QuotationSliceState = {
  currentQuotation: null,
  currentStep: JSON.parse(localStorage.getItem(CURRENT_ACTIVE_STEP) || "0"),
  days: [],
  selectedDay: JSON.parse(
    localStorage.getItem(ITINERARY_CURRENT_SELECTED_DAY) || "null"
  ),

  operationType: null,
};

export const quotationSlice = createSlice({
  name: "quotation",
  initialState,
  reducers: {
    onSetCurrentQuotation: (
      state,
      { payload }: PayloadAction<LocalQuotationEntity | null>
    ) => {
      return {
        ...state,
        currentQuotation: payload,
      };
    },

    onSetCurrentStep: (state, { payload }: PayloadAction<number>) => {
      localStorage.setItem(CURRENT_ACTIVE_STEP, JSON.stringify(payload));
      return {
        ...state,
        currentStep: payload,
      };
    },

    

    onSetSelectedDay: (state, { payload }: PayloadAction<Day | null>) => {
      localStorage.setItem(
        ITINERARY_CURRENT_SELECTED_DAY,
        JSON.stringify(payload)
      );
      return {
        ...state,
        selectedDay: payload ?? null,
      };
    },

    onSetDays: (state, { payload }: PayloadAction<Day[]>) => {
      return {
        ...state,
        days: payload,
      };
    },

    onSetOperationType: (
      state,
      { payload }: PayloadAction<"create" | "edit" | "replace" | null>
    ) => {
      return {
        ...state,
        operationType: payload,
      };
    }
  },
});

export const {
  onSetCurrentQuotation,
  onSetCurrentStep,
  onSetSelectedDay,
  onSetDays,
  onSetOperationType,
} = quotationSlice.actions;
