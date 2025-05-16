import type { AppState } from "@/app/store";
import { getDeviceKey } from "@/core/utils";
import type { UserEntity } from "@/domain/entities";
import { toasterAdapter } from "@/presentation/components";
import type { Dispatch } from "@reduxjs/toolkit";
import type { Socket } from "socket.io-client";
import { reservationCache } from "../reservation/reservation.cache";
import { SocketManager } from "../socket/socket.service";
import { userCache } from "../user/user.cache";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";
import { setusersDevicesConnections } from "../../slices/users.slice";
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
      (data: { userId: UserEntity["id"]; devices: DeviceSocketRes[] }) => {
        // dispatch(onOnline(true));

    

        //* Update user to online
        versionQuotationCache.updateByUserId(
          +data.userId,
          true,
          dispatch,
          getState
        );

        userCache.updateById(
          +data.userId,
          true,
          dispatch,
          getState as () => AppState
          // data.devices
        );

        dispatch(
          setusersDevicesConnections(data.devices)
        );

       

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
    socket?.on(
      "userDisconnected",
      (data: UserEntity["id"]) => {
        // dispatch(onOnline(false));

        //* Update user to online
        versionQuotationCache.updateByUserId(
          +data,
          false,
          dispatch,
          getState
        );

        
       

        userCache.updateById(
          +data,
          false,
          dispatch,
          getState as () => AppState
        );

        reservationCache.updateReservationByUser(
          {
            id: +data,
            online: false,
          },
          dispatch,
          getState
        );
      }
    );
  },

  deviceDisconnected: (socket: Socket) => {
    socket?.on(
      "deviceDisconnected",
      (data: { devices: DeviceSocketRes[]; userId: UserEntity["id"] }) => {
        dispatch(
          setusersDevicesConnections(data.devices)
        );
      }
    );
  },

  forceLogout: (socket: Socket) => {
    socket?.on("force-logout", async (data) => {
      const browserId = await getDeviceKey();
      
      if (data.oldDeviceId.toLowerCase() === browserId.toLowerCase()) {
        const { browser, os } = getLoginMessageFromDeviceId(data.newDeviceId);

        toasterAdapter.connected(browser, os);

        setTimeout(() => {
          window.location.href = "/login";
        }, 5000);
      }
    });
  },
});

function getLoginMessageFromDeviceId(deviceId: string) {
  const regex = /^([\w-]+)_\d+_([\w\s]+)$/;
  const match = deviceId.match(regex);

  if (!match) {
    return {
      browser: "Desconocido",
      os: "Desconocido",
    };
  }

  const browser = match[1]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitaliza palabras

  const os = match[2]
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    browser,
    os,
  };
}
