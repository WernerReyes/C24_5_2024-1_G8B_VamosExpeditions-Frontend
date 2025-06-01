import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoleEnum, type UserEntity } from "@/domain/entities";
import { DeviceSocketRes } from "../services/auth/auth.response";
import { getDeviceKey } from "@/core/utils";

export enum AuthStatus {
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}

export type AuthSliceState = {
  status: AuthStatus;
  authUser: null | UserEntity;
  isManager: boolean;
  currentDeviceKey: string;
};

const initialState: AuthSliceState = {
  status: AuthStatus.UNAUTHENTICATED,
  authUser: null,
  isManager: false,
  currentDeviceKey: getDeviceKey(),
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
        isManager: payload.role?.name === RoleEnum.MANAGER_ROLE,
      };
    },

    onOnline: (state, { payload }: PayloadAction<UserEntity["online"]>) => {
      if (state.authUser?.id) {
        return {
          ...state,
          authUser: {
            ...state.authUser,
            online: payload,
          },
        };
      }
      return state;
    },
    onLogout: (state) => {
      return {
        ...state,
        status: AuthStatus.UNAUTHENTICATED,
        authUser: null,
      };
    },

    onRemoveDevice: (state, { payload }: PayloadAction<string>) => {
      if (state.authUser?.id) {
        return {
         ...state,
          authUser: {
           ...state.authUser,
            activeDevices: state.authUser.activeDevices?.filter(
              (device) => device.deviceId !== payload
            ),
          },
        };
      }
    },

    onActiveDevice: (state, { payload }: PayloadAction<DeviceSocketRes[]>) => {
      if (state.authUser?.id) {
        const deviceByUserId = payload.find(
          (device) => device.userId === state.authUser?.id
        );
        return {
          ...state,
          authUser: {
            ...state.authUser,
            activeDevices: state.authUser.activeDevices?.map((device) => {
              return {
                ...device,
                isOnline: deviceByUserId ? deviceByUserId.ids.includes(device.deviceId) : false,
              };
            }),
          },
        };
      }
      return state;
    },
  },
});

export const { onLogin, onLogout, onOnline, onActiveDevice, onRemoveDevice } =
  authSlice.actions;
