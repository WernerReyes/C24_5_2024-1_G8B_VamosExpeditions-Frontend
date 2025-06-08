import { AppState } from "@/app/store";
import { constantEnvs } from "@/core/constants/env.const";
import { createApi } from "@reduxjs/toolkit/query/react";
import { io, Socket } from "socket.io-client";
import { authSocketListeners } from "../auth/auth.socket";
import { requestConfig } from "../config";
import { notificationSocketListeners } from "../notification/notification.socket";
import { detectBrowser } from "@/core/utils";

const { VITE_API_URL } = constantEnvs;

export class SocketManager {
  private static instance: Socket | null = null;
  private static subscribers = 0;

  static connect(token?: string) {
    if (!this.instance) {
      this.instance = io(VITE_API_URL, {
        transports: ["websocket"],
        auth: {
          browserName: detectBrowser(),
          // "token": token,
          //  "2fa": token,
          token: token,
        },
        autoConnect: true,
        withCredentials: true,
        reconnectionDelay: 1000,
      });
    }
    this.subscribers++;
    this.instance.auth = {
      browserName: detectBrowser(),
      // "token": token,
      token: token,
    };

    return this.instance;
  }

  static disconnect() {
    this.subscribers--;
    if (this.instance && this.subscribers <= 0) {
      this.instance.disconnect();
      this.instance = null;
    }
  }

  static getInstance() {
    return this.instance;
  }
}

const PREFIX = "";
export const SocketService = createApi({
  reducerPath: "socketApi",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    connectSocket: builder.query<void, string | undefined>({
      queryFn: () => ({ data: undefined }),

      async onCacheEntryAdded(
        token,
        { cacheDataLoaded, cacheEntryRemoved, dispatch, getState }
      ) {
        await cacheDataLoaded;

        // const token = window.location.pathname.split("/")[2];

        const socket = SocketManager.connect(token);
        const authSocket = authSocketListeners(
          dispatch,
          getState as () => AppState
        );
        if (token) {
          authSocket.success2FA(socket);
          return;
        }

        socket?.on("connect", () => {
          authSocket.userConnected(socket);
          authSocket.userDisconnected(socket);
          authSocket.deviceDisconnected(socket);
        });
        // authSocket.success2FA(socket);
        authSocket.logoutDevice(socket);
        authSocket.forceLogout(socket);

        const notificationSocket = notificationSocketListeners(dispatch);
        notificationSocket.getPersonalMessages(socket);

        socket?.on("disconnect", () => {
          console.log("Disconnected from socket server");
        });

        await cacheEntryRemoved;
        SocketManager?.disconnect();
      },
    }),
  }),
});

export const { useConnectSocketQuery } = SocketService;
