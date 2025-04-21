import type { VersionQuotationEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type VersionQuotationSliceState = {
  currentVersionQuotation: VersionQuotationEntity | null;
  archivedVersions?: Record<number, number>;
};

const initialState: VersionQuotationSliceState = {
  currentVersionQuotation: null,
  archivedVersions: undefined,
};

export const versionquotationSlice = createSlice({
  name: "Versionquotation",
  initialState,
  reducers: {
    onSetCurrentVersionQuotation: (
      state,
      { payload }: PayloadAction<VersionQuotationEntity | null>
    ) => {
      return {
        ...state,
        currentVersionQuotation: payload,
      };
    },

    onSetNumberOfVersions: (
      state,
      { payload }: PayloadAction<Record<number, number>>
    ) => {
      return {
        ...state,
        archivedVersions: {
          ...state.archivedVersions,
          ...payload,
        },
      };
    },

    onDiscountNumberOfVersions: (
      state,
      { payload }: PayloadAction<{ quotationId: number }>
    ) => {
      if (state.archivedVersions) {
        const { [payload.quotationId]: _, ...rest } = state.archivedVersions;
        return {
          ...state,
          archivedVersions: {
            ...rest,
            [payload.quotationId]: state.archivedVersions[payload.quotationId] - 1,
          }
        };
      }
      return state;
    },
  },
});

export const { onSetCurrentVersionQuotation, onSetNumberOfVersions, onDiscountNumberOfVersions } =
  versionquotationSlice.actions;
