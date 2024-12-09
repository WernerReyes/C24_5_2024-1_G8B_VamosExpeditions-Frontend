import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AccommodationQuoteEntity } from "@/domain/entities";
import { constantStorage } from "@/core/constants";
import { SetAccomodationQuoteDto } from "@/domain/dtos/accommodationQuote";

const { LOCAL_ACCOMMODATION_QUOTES } = constantStorage;

export type AccommodationQuoteSliceState = {
  accommodationQuotes: AccommodationQuoteEntity[];
  selectedAccommodationQuote: AccommodationQuoteEntity | null;
  localAccommodationQuotes: SetAccomodationQuoteDto[];
};

const initialState: AccommodationQuoteSliceState = {
  accommodationQuotes: [],
  selectedAccommodationQuote: null,
  localAccommodationQuotes: JSON.parse(
    localStorage.getItem(LOCAL_ACCOMMODATION_QUOTES) || "[]"
  ),
};

export const accommodationQuoteSlice = createSlice({
  name: "accommodation-quote",
  initialState,
  reducers: {
    onSetAccommodationQuotes: (
      state,
      { payload }: PayloadAction<AccommodationQuoteEntity[]>
    ) => {
      return {
        ...state,
        accommodationQuotes: payload,
      };
    },

    onSetSelectedAccommodationQuote: (
      state,
      { payload }: PayloadAction<AccommodationQuoteEntity>
    ) => {
      return {
        ...state,
        selectedAccommodationQuote: payload,
      };
    },

    onSetLocalAccommodationQuote: (
      state,
      { payload }: PayloadAction<SetAccomodationQuoteDto>
    ) => {
      localStorage.setItem(
        LOCAL_ACCOMMODATION_QUOTES,
        JSON.stringify([...state.localAccommodationQuotes, payload])
      );
      return {
        ...state,
        localAccommodationQuotes: [...state.localAccommodationQuotes, payload],
      };
    },
  },
});

export const {
  onSetAccommodationQuotes,
  onSetSelectedAccommodationQuote,
  onSetLocalAccommodationQuote,
} = accommodationQuoteSlice.actions;
