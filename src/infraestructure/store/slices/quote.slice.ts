import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { QuoteEntity } from "@/domain/entities";
import { dateFnsAdapter } from "@/core/adapters";
import { getValidationError } from "@/core/utils";

export type QuoteSliceState = {
  error: string | null;
  isLoading: boolean;
  quotes: QuoteEntity[];
  selectedQuote: QuoteEntity | null;
};

const initialState: QuoteSliceState = {
  error: null,
  isLoading: false,
  quotes: [],
  selectedQuote: null,
};

const codeMatcher = {
  ERR_NETWORK:
    "Ocurrió un error al cargar las cotizaciones, por favor intenta de nuevo.",
};

export const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {
    onLoading: (state) => {
      return {
        ...state,
        isLoading: true,
      };
    },

    onSetError: (state, { payload = null }: PayloadAction<any>) => {
      return {
        ...state,
        error: payload.code ? getValidationError(payload.code, codeMatcher) : null,
        isLoading: false,
      };
    },

    onSetQuotes: (state, { payload }: PayloadAction<QuoteEntity[]>) => {
      return {
        ...state,
        quotes: getParsedDate(payload),
        isLoading: false,
      };
    },
    onSetSelectedQuote: (state, { payload }: PayloadAction<QuoteEntity>) => {
      return {
        ...state,
        selectedQuote: payload,
        isLoading: false,
      };
    },
  },
});

export const { onLoading, onSetError, onSetQuotes, onSetSelectedQuote } =
  quoteSlice.actions;

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
// getValidationError
