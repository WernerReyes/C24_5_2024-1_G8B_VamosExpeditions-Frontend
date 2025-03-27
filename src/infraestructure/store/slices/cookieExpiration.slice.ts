import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  expiration: "",
  isExpired: false,
};

export const cookieExpirationSlice = createSlice({
  name: "cookieExpiration",
  initialState,
  reducers: {
    onSetCookieExpiration: (state, { payload }: PayloadAction<string>) => {
      return {
        ...state,
        expiration: payload,
      };
    },
    onSetExpired: (state, { payload }: PayloadAction<boolean>) => {
      return {
        ...state,
        isExpired: payload,
      };
    },
  },
});

export const { onSetCookieExpiration, onSetExpired } = cookieExpirationSlice.actions;
