import type { VersionQuotationEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type VersionQuotationSliceState = {
  currentVersionQuotation: VersionQuotationEntity | null;
  versionQuotations: VersionQuotationEntity[];
};

const initialState: VersionQuotationSliceState = {
  currentVersionQuotation: null,
  versionQuotations: [],
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
        isUpdating: true,
      };
    },

    onSetVersionQuotations: (
      state,
      { payload }: PayloadAction<VersionQuotationEntity[]>
    ) => {
      return {
        ...state,
        versionQuotations: payload,
      };
    },

    onUpsertVersionQuotation: (
      state,
      { payload }: PayloadAction<VersionQuotationEntity>
    ) => {
      const index = state.versionQuotations.findIndex(
        (v) =>
          v.id.quotationId === payload.id.quotationId &&
          v.id.versionNumber === payload.id.versionNumber
      );

      if (index === -1) {
        state.versionQuotations.push(payload);
      } else {
        state.versionQuotations[index] = payload;
      }
    },
  },
});

export const {
  onSetCurrentVersionQuotation,
  onSetVersionQuotations,
  onUpsertVersionQuotation,
} = versionquotationSlice.actions;
