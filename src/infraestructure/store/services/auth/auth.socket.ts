import type { AppState } from "@/app/store";
import { authService } from "@/data";
import type { UserEntity } from "@/domain/entities";
import { toasterAdapter } from "@/presentation/components";
import type { Dispatch } from "@reduxjs/toolkit";
import type { Socket } from "socket.io-client";
import { onActiveDevice } from "../../slices/auth.slice";
import { setusersDevicesConnections } from "../../slices/users.slice";
import { reservationCache } from "../reservation/reservation.cache";
import { SocketManager } from "../socket/socket.service";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";
import type { DeviceSocketRes } from "./auth.response";

export const authSocket = {
  userConnected: () => {
    const socket = SocketManager.getInstance();
    if (!socket?.connected) {
      socket?.connect();
      socket?.once("connect", () => {
        socket.emit("connection");
      });
    } else {
      socket.emit("connection");
    }
  },

  userDisconnected: () => {
    const socket = SocketManager.getInstance();
    socket?.disconnect();
  },
};

export const authSocketListeners = (
  dispatch: Dispatch,
  getState: () => AppState
) => ({
  userConnected: (socket: Socket) => {
    socket?.on(
      "userConnected",
      (data: { userId: UserEntity["id"]; devices: DeviceSocketRes }) => {
        // dispatch(onOnline(true));

        //* Update user to online
        versionQuotationCache.updateByUserId(
          +data.userId,
          true,
          dispatch,
          getState
        );

  

        dispatch(setusersDevicesConnections(data.devices));

        dispatch(onActiveDevice(data.devices));

        reservationCache.updateReservationByUser(
          {
            id: +data.userId,
            online: true,
          },
          dispatch,
          getState
        );
      }
    );
  },

  userDisconnected: (socket: Socket) => {
    socket?.on("userDisconnected", (data: UserEntity["id"]) => {
      //* Update user to online
      versionQuotationCache.updateByUserId(+data, false, dispatch, getState);
      
      reservationCache.updateReservationByUser(
        {
          id: +data,
          online: false,
        },
        dispatch,
        getState
      );
    });
  },

  deviceDisconnected: (socket: Socket) => {
    socket?.on(
      "deviceDisconnected",
      (data: { devices: DeviceSocketRes; userId: UserEntity["id"] }) => {
        dispatch(setusersDevicesConnections(data.devices));

        dispatch(onActiveDevice(data.devices));
      }
    );
  },

  logoutDevice: (socket: Socket) => {
    socket?.on("disconnect-device", async (deviceId: string) => {
      const { id } = await authService.getDeviceConnection();
    
      // const browserId = cookie ? cookie : "";
      if (deviceId === id) {
        toasterAdapter.disconnectDevice();

        setTimeout(() => {
          window.location.href = "/login";
        }, 5000);
      }
    });
  },

  forceLogout: (socket: Socket) => {
    socket?.on("force-logout", async (data) => {
      const { id } = await authService.getDeviceConnection();

      if (data.oldDeviceId === id) {
       
        toasterAdapter.connected();

        setTimeout(() => {
          window.location.href = "/login";
        }, 5000);
      }
    });
  },
});

