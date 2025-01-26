import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { QuoteEntity } from "@/domain/entities";
import { dateFnsAdapter } from "@/core/adapters";

type QuoteSliceState = {
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
      console.log({hola: "payload" });
      return {
        ...state,
        quotes: payload,
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
      d.startDate = dateFnsAdapter.parseISO(d.startDate);
      d.endDate = dateFnsAdapter.parseISO(d.endDate);
    }

    if (d.versions.length > 0) {
      d.versions.forEach((v) => {
        if (typeof v.startDate === "string" && typeof v.endDate === "string") {
          v.startDate = dateFnsAdapter.parseISO(v.startDate);
          v.endDate = dateFnsAdapter.parseISO(v.endDate);
        }
      });
    }

    return d;
  });
};
// getValidationError
