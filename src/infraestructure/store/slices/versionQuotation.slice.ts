import type { VersionQuotationEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type VersionQuotationSliceState = {
  currentVersionQuotation: VersionQuotationEntity | null;
};

const initialState: VersionQuotationSliceState = {
  currentVersionQuotation: null,
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
  },
});

export const { onSetCurrentVersionQuotation } = versionquotationSlice.actions;
