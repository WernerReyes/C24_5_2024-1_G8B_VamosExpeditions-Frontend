import { NotificationMessageEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import { notificationCache } from "./notification.cache";
import type { ApiResponse } from "../response";

const PREFIX = "/notification";

export const notificationService = createApi({
  reducerPath: "notificationService",
  baseQuery: requestConfig(PREFIX),

  endpoints: (builder) => ({
    getAllNotifications: builder.query<NotificationMessageEntity[], void>({
      query: () => `/messages`,
    }),

    deleteNotifications: builder.mutation<
      ApiResponse<number[]>,
      { id: number[] }
    >({
      query: ({ id }) => ({
        url: `/delete`,
        method: "POST",
        body: { ids: id },
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          notificationCache.deleteNotification(data.data, dispatch);
        } catch {}
      },
    }),

    markNotificationsAsRead: builder.mutation<
      ApiResponse<number[]>,
      { id: number[] }
    >({
      query: ({ id }) => ({
        url: `/mark-as-read`,
        method: "PUT",
        body: { ids: id },
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          notificationCache.markNotificationAsRead(data.data, dispatch);
        } catch {}
      },
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useDeleteNotificationsMutation,
  useMarkNotificationsAsReadMutation,
} = notificationService;
