import { UserEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaginatedResponse } from "../services";
import { DeviceSocketRes } from "../services/auth/auth.response";

export type UsersState = {
  usersPagination: PaginatedResponse<UserEntity>;
  isLoadingUsers?: boolean;
  newLimit: number;
  usersDevicesConnections: DeviceSocketRes[];
};

const initialState: UsersState = {
  usersPagination: {
    content: [],
    totalPages: 0,
    limit: 10,
    page: 0,
    total: 0,
  },
  isLoadingUsers: false,
  newLimit: 10,
  usersDevicesConnections: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsersPagination: (
      state,
      { payload }: PayloadAction<PaginatedResponse<UserEntity>>
    ) => {
      state.usersPagination = payload;
    },

    setLoadingUsers: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoadingUsers = payload;
    },

    setNewLimit: (state) => {
      state.newLimit = state.newLimit + 10;
    },

    setusersDevicesConnections: (
      state,
      {
        payload,
      }: PayloadAction<DeviceSocketRes[]>
    ) => {
      console.log({
        payload,
      });
      return {
        ...state,
        usersDevicesConnections: payload,
      };
    },
  },
});

export const {
  setUsersPagination,
  setusersDevicesConnections,
  setNewLimit,
  setLoadingUsers,
} = usersSlice.actions;
