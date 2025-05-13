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

  static connect() {
    if (!this.instance) {
      this.instance = io(VITE_API_URL, {
        transports: ["websocket"],
       auth: {
        "browserName": detectBrowser(),
       },
        autoConnect: true,
        withCredentials: true,
      });
    }
    this.subscribers++;
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
    connectSocket: builder.query<void, void>({
      queryFn: () => ({ data: undefined }),

      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, dispatch, getState }
      ) {
        await cacheDataLoaded;

        const socket = SocketManager.connect();
        const authSocket = authSocketListeners(
          dispatch,
          getState as () => AppState
        );


        socket?.on("connect", () => {
          authSocket.userConnected(socket);
          authSocket.userDisconnected(socket);
          authSocket.deviceDisconnected(socket);
          
        });
        
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
