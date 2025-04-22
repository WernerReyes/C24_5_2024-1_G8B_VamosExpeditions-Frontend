import type { AppState } from "@/app/store";
import { getDeviceKey } from "@/core/utils";
import type { UserEntity } from "@/domain/entities";
import type { Dispatch } from "@reduxjs/toolkit";
import type { Socket } from "socket.io-client";
import { reservationCache } from "../reservation/reservation.cache";
import { SocketManager } from "../socket/socket.service";
import { userCache } from "../user/user.cache";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";

export const authSocket = {
  userConnected: () => {
    const socket = SocketManager.getInstance();
    if (!socket?.connected) {
      socket?.connect();

      // Esperar a que el socket esté listo
      socket?.once("connect", () => {
        socket.emit("connection");
        console.log("Emitido 'connection' tras establecer conexión");
      });
    } else {
      socket.emit("connection");
      console.log(
        "Emitido 'connection' inmediatamente porque ya estaba conectado"
      );
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
    socket?.on("userConnected", (data: UserEntity["id"]) => {
      // dispatch(onOnline(true));

      //* Update user to online
      versionQuotationCache.updateByUserId(+data, true, dispatch, getState);

      userCache.updateById(+data, true, dispatch, getState as () => AppState);

      reservationCache.updateReservationByUser(
        {
          id: +data,
          online: true,
        },
        dispatch,
        getState
      );
    });
  },

  userDisconnected: (socket: Socket) => {
    socket?.on("userDisconnected", (data: UserEntity["id"]) => {
      // dispatch(onOnline(false));

      //* Update user to online
      versionQuotationCache.updateByUserId(+data, false, dispatch, getState);

      userCache.updateById(+data, false, dispatch, getState as () => AppState);

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

  forceLogout: (socket: Socket) => {
    socket?.on("force-logout", async (data) => {
      const browserId = await getDeviceKey();
      console.log(data);
      if (data.oldDeviceId.toLowerCase() === browserId.toLowerCase()) {
        alert(getLoginMessageFromDeviceId(data.newDeviceId));
      }
    });
  },
});

function getLoginMessageFromDeviceId(deviceId: string): string {
  const regex = /^([\w-]+)_\d+_([\w\s]+)$/;
  const match = deviceId.match(regex);

  if (!match) {
    return "Se inició sesión desde otro dispositivo.";
  }

  const browser = match[1]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitaliza palabras

  const os = match[2]
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return `Se inició sesión desde otro navegador ${browser} en un dispositivo ${os}.`;
}
