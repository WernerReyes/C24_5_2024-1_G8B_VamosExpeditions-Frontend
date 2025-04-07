import { constantEnvs } from "@/core/constants/env.const";
import { SocketDto } from "@/domain/dtos/socket/socket.dto";
import { createApi } from "@reduxjs/toolkit/query/react";
import { io, Socket } from "socket.io-client";

import { AppState } from "@/app/store";
import { startShowError, startShowSuccess } from "@/core/utils";
import { NotificationMessageEntity } from "@/domain/entities";
import { requestConfig } from "../config";
import { userCache } from "../user/user.cache";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";

const { VITE_API_URL } = constantEnvs;

export class SocketManager {
  private static instance: Socket | null = null;
  private static subscribers = 0;

  static connect() {
    if (!this.instance) {
      this.instance = io(VITE_API_URL, {
        transports: ["websocket"],
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

const PREFIX = "/notification";
export const SocketService = createApi({
  reducerPath: "socketApi",
  baseQuery: requestConfig(PREFIX),
  tagTypes: ["Messages", "User"],

  endpoints: (builder) => ({
    connectSocket: builder.query<void, void>({
      queryFn: () => ({ data: undefined }),

      async onCacheEntryAdded(
        _,
        { cacheDataLoaded, cacheEntryRemoved, dispatch, getState }
      ) {
        await cacheDataLoaded;

        const socket = SocketManager.connect();

        socket?.on("connect", () => {
          startShowSuccess("conectado al servidor de sockets");
          socket?.on("userConnected", (data) => {
            //* Update user to online
            versionQuotationCache.updateVersionQuotationByUserId(
              +data,
              true,
              dispatch,
              getState as () => AppState
            );

            userCache.updateById(
              +data,
              true,
              dispatch,
              getState as () => AppState
            );
          });

          socket?.on("userDisconnected", (data) => {
            //* Update user to online
            versionQuotationCache.updateVersionQuotationByUserId(
              +data,
              false,
              dispatch,
              getState as () => AppState
            );

            userCache.updateById(
              +data,
              false,
              dispatch,
              getState as () => AppState
            );
          });
        });

        socket?.on("disconnect", () => {
          startShowError("desconectado del servidor de sockets");
        });

        await cacheEntryRemoved;
        SocketManager?.disconnect();

        console.log("🔌 Socket cerrado por eliminación de caché");
      },
    }),

    sendMessage: builder.mutation<void, SocketDto>({
      queryFn: async (formData) => {
        try {
          const socket = SocketManager.getInstance();

          socket?.emit("personal-message", formData);

          return { data: undefined };
        } catch (error) {
          return {
            error: {
              status: 500,
              data: { message: "Error al enviar el mensaje" },
            },
          };
        }
      },
    }),

    listUserNotifications: builder.query<
      NotificationMessageEntity[],
      undefined
    >({
      query: () => `/messages`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Messages" as const, id })),
              { type: "Messages", id: "LIST" },
            ]
          : [{ type: "Messages", id: "LIST" }],

      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        await cacheDataLoaded;
        const socket = SocketManager.connect();

        socket.on("personal-message", (data) => {
          updateCachedData((draft) => {
            draft.unshift(data);
          });
        });
        await cacheEntryRemoved;

        SocketManager.disconnect();
      },
    }),

    deleteNotifications: builder.mutation<void, { id: number[] }>({
      query: ({ id }) => ({
        url: `/delete`,
        method: "POST",
        body: { ids: id },
      }),
      invalidatesTags: ["Messages"],
    }),

    markNotificationsAsRead: builder.mutation<void, { id: number[] }>({
      query: ({ id }) => ({
        url: `/mark-as-read`,
        method: "PUT",
        body: { ids: id },
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const {
  useConnectSocketQuery,
  useSendMessageMutation,

  useListUserNotificationsQuery,
  useDeleteNotificationsMutation,
  useMarkNotificationsAsReadMutation,
} = SocketService;
