import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserEntity } from "@/domain/entities";

export enum AuthStatus {
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}

export type AuthSliceState = {
  status: AuthStatus;
  authUser: null | UserEntity;
};

const initialState: AuthSliceState = {
  status: AuthStatus.UNAUTHENTICATED,
  authUser: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onLogin: (state, { payload }: PayloadAction<UserEntity>) => {
      return {
        ...state,
        status: AuthStatus.AUTHENTICATED,
        authUser: payload,
      };
    },
    onLogout: (state) => {
      return {
        ...state,
        status: AuthStatus.UNAUTHENTICATED,
        authUser: null,
      };
    },
  },
});

export const { onLogin, onLogout } = authSlice.actions;
