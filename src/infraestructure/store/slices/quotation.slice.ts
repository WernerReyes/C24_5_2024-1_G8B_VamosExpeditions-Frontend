import { constantStorage } from "@/core/constants";
import { LocalQuotationEntity } from "@/data";
import type { QuotationEntity } from "@/domain/entities";
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
  quotations: QuotationEntity[];
  days: Day[];
  selectedDay: Day | null;
};

const initialState: QuotationSliceState = {
  currentQuotation: null,
  currentStep: JSON.parse(localStorage.getItem(CURRENT_ACTIVE_STEP) || "0"),
  quotations: [],
  days: [],
  selectedDay: JSON.parse(
    localStorage.getItem(ITINERARY_CURRENT_SELECTED_DAY) || "null"
  ),
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

    onSetQuotations: (state, { payload }: PayloadAction<QuotationEntity[]>) => {
      return {
        ...state,
        quotations: payload,
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
    }
  },
});

export const {
  onSetCurrentQuotation,
  onSetCurrentStep,
  onSetQuotations,
  onSetSelectedDay,
  onSetDays,
} = quotationSlice.actions;
