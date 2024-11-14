import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { QuoteEntity } from "@/domain/entities";
import { dateFnsAdapter } from "@/core/adapters";

export type QuoteSliceState = {
  quotes: QuoteEntity[];
  selectedQuote: QuoteEntity | null;
};

const initialState: QuoteSliceState = {
  quotes: [],
  selectedQuote: null,
};

export const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {
    onSetQuotes: (state, { payload }: PayloadAction<QuoteEntity[]>) => {
      return {
        ...state,
        quotes: getParsedDate(payload),
      };
    },
    onSetSelectedQuote: (state, { payload }: PayloadAction<QuoteEntity>) => {
      return {
        ...state,
        selectedQuote: payload,
      };
    },
  },
});

export const { onSetQuotes, onSetSelectedQuote } = quoteSlice.actions;

//* Utils

const getParsedDate = (data: QuoteEntity[]) => {
  return [...(data || [])].map((d) => {
    if (typeof d.startDate === "string" && typeof d.endDate === "string") {
      d.startDate = dateFnsAdapter.parse(d.startDate);
      d.endDate = dateFnsAdapter.parse(d.endDate);
    }

    if (d.versions.length > 0) {
      d.versions.forEach((v) => {
        if (typeof v.startDate === "string" && typeof v.endDate === "string") {
          v.startDate = dateFnsAdapter.parse(v.startDate);
          v.endDate = dateFnsAdapter.parse(v.endDate);
        }
      });
    }

    return d;
  });
};
