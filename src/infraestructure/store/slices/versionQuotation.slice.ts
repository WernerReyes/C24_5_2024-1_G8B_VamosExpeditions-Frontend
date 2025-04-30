import type { VersionQuotationEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type VersionQuotationSliceState = {
  currentVersionQuotation: VersionQuotationEntity | null;
  trashVersions?: Record<number, number>;
};

const initialState: VersionQuotationSliceState = {
  currentVersionQuotation: null,
  trashVersions: undefined,
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
        trashVersions: {
          ...state.trashVersions,
          ...payload,
        },
      };
    },

    onDiscountNumberOfVersions: (
      state,
      { payload }: PayloadAction<{ quotationId: number }>
    ) => {
      if (state.trashVersions) {
        const { [payload.quotationId]: _, ...rest } = state.trashVersions;
        return {
          ...state,
          trashVersions: {
            ...rest,
            [payload.quotationId]:
              state.trashVersions[payload.quotationId] - 1,
          },
        };
      }
      return state;
    },

    onAddNumberOfVersions: (
      state,
      { payload }: PayloadAction<{ quotationId: number }>
    ) => {
      if (state.trashVersions) {
        return {
          ...state,
          trashVersions: {
            ...state.trashVersions,
            [payload.quotationId]:
              state.trashVersions[payload.quotationId] + 1,
          },
        };
      } else {
        return {
          ...state,
          trashVersions: {
            [payload.quotationId]: 1,
          },
        };
      }
    },
  },
});

export const {
  onSetCurrentVersionQuotation,
  onSetNumberOfVersions,
  onAddNumberOfVersions,
  onDiscountNumberOfVersions,
} = versionquotationSlice.actions;
