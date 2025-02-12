import { constantStorage } from "@/core/constants";
import { LocalQuotationEntity } from "@/data";
import type { QuotationEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const {
  CURRENT_ACTIVE_STEP,
  ITINERARY_CURRENT_SELECTED_DAY,
  INDIRECT_COSTS_PERCENTAGE,
  PROFIT_MARGIN
} = constantStorage;

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
  indirectCostPercentage: number;
  profitPercentage: number;
};

const initialState: QuotationSliceState = {
  currentQuotation: null,
  currentStep: JSON.parse(localStorage.getItem(CURRENT_ACTIVE_STEP) || "0"),
  quotations: [],
  days: [],
  selectedDay: JSON.parse(
    localStorage.getItem(ITINERARY_CURRENT_SELECTED_DAY) || "null"
  ),
  indirectCostPercentage: JSON.parse(
    localStorage.getItem(INDIRECT_COSTS_PERCENTAGE) || "5"
  ),
  profitPercentage: JSON.parse(
    localStorage.getItem(PROFIT_MARGIN) || "80"
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
    },

    onSetIndirectCostPercentage: (
      state,
      { payload }: PayloadAction<number>
    ) => {
      localStorage.setItem(INDIRECT_COSTS_PERCENTAGE, JSON.stringify(payload));
      return {
        ...state,
        indirectCostPercentage: payload,
      };
    },

    onSetProfitPercentage: (
      state,
      { payload }: PayloadAction<number>
    ) => {
      localStorage.setItem(PROFIT_MARGIN, JSON.stringify(payload));
      return {
        ...state,
        profitPercentage: payload,
      };
    },
  },
});

export const {
  onSetCurrentQuotation,
  onSetCurrentStep,
  onSetQuotations,
  onSetSelectedDay,
  onSetDays,
  onSetIndirectCostPercentage,
  onSetProfitPercentage,
} = quotationSlice.actions;
