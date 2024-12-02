import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserEntity } from "@/domain/entities";
import { constantStorage } from "@/core/constants";

const { USER_AUTH } = constantStorage;

export enum AuthStatus {
  CHECKING = "checking",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}

export type AuthSliceState = {
  status: AuthStatus;
  authUser: null | UserEntity;
};

const initialState: AuthSliceState = {
  status: localStorage.getItem(USER_AUTH)
    ? AuthStatus.AUTHENTICATED
    : AuthStatus.UNAUTHENTICATED,
  authUser: localStorage.getItem(USER_AUTH)
    ? JSON.parse(localStorage.getItem(USER_AUTH) as string)
    : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onChecking: (state) => {
      return {
        ...state,
        status: AuthStatus.CHECKING,
      };
    },

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

export const { onChecking, onLogin, onLogout } = authSlice.actions;
