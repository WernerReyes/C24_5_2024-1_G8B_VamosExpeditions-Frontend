import type { AppState } from "@/app/store";
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
    }
    socket?.emit("connection");
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
      //* Update user to online
      versionQuotationCache.updateVersionQuotationByUserId(
        +data,
        true,
        dispatch,
        getState
      );

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
      //* Update user to online
      versionQuotationCache.updateVersionQuotationByUserId(
        +data,
        false,
        dispatch,
        getState
      );

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
});
