import { CountryEntity } from "@/domain/entities";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type NationSliceState = {
  nations: CountryEntity[];
};

const initialState: NationSliceState = {
  nations: [],
};

export const nationSlice = createSlice({
  name: "nation",
  initialState,
  reducers: {
    onSetCountries: (
      state,
      { payload }: PayloadAction<CountryEntity[]>
    ) => {
      return {
        ...state,
        nations: payload,
      };
    },
  },
});

export const { onSetCountries } = nationSlice.actions;
