import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ExternalCountryEntity } from "@/infraestructure/store/services";

export type ExternalCountrySliceState = {
  externalCountries: ExternalCountryEntity[];
  selectedExternalCountry: ExternalCountryEntity | null;
};

const initialState: ExternalCountrySliceState = {
  externalCountries: [],
  selectedExternalCountry: null,
};

export const externalCountrySlice = createSlice({
  name: "external-country",
  initialState,
  reducers: {
    onSetExternalCountries: (
      state,
      { payload }: PayloadAction<ExternalCountryEntity[]>
    ) => {
      return {
        ...state,
        externalCountries: payload,
      };
    },
    onSetSelectedExternalCountry: (
      state,
      { payload }: PayloadAction<ExternalCountryEntity>
    ) => {
      return {
        ...state,
        selectedExternalCountry: payload,
      };
    },
  },
});

export const { onSetExternalCountries, onSetSelectedExternalCountry } =
  externalCountrySlice.actions;
