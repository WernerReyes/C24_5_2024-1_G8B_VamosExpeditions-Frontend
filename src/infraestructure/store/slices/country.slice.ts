import { CountryEntity } from "@/domain/entities";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type countrySliceState = {
  countries: CountryEntity[];
};

const initialState: countrySliceState = {
  countries: [],
};

export const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    onSetCountries: (
      state,
      { payload }: PayloadAction<CountryEntity[]>
    ) => {
      return {
        ...state,
        countries: payload,
      };
    },
  },
});

export const { onSetCountries } = countrySlice.actions;
