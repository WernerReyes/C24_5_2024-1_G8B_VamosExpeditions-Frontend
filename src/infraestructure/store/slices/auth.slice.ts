import { RoleEnum, type UserEntity } from "@/domain/entities";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DeviceSocketRes } from "../services/auth/auth.response";

export enum AuthStatus {
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}

export type AuthSliceState = {
  status: AuthStatus;
  authUser: null | UserEntity;
  isManager: boolean;
  currentDeviceKey: string | null;
};

const initialState: AuthSliceState = {
  status: AuthStatus.UNAUTHENTICATED,
  authUser: null,
  isManager: false,
  currentDeviceKey: null
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
              (device) => device.id !== payload
            ),
          },
        };
      }
    },

    onActiveDevice: (
      state,
      { payload }: PayloadAction<DeviceSocketRes>
    ): AuthSliceState => {
      if (state.authUser?.id && payload[state.authUser.id]) {
        return {
          ...state,
          authUser: {
            ...state.authUser,
            activeDevices: payload[state.authUser.id],
          },
        };
      }
      return state;
    },

    onSetCurrentDeviceKey: (state, { payload }: PayloadAction<string>) => {
      return {
       ...state,
        currentDeviceKey: payload,
      };
    }
  },
});

export const { onLogin, onLogout, onOnline, onActiveDevice, onRemoveDevice, 
  onSetCurrentDeviceKey
 } =
  authSlice.actions;
