import { constantEnvs } from "@/core/constants/env.const";
import { createApi } from "@reduxjs/toolkit/query/react";
import { io, Socket } from "socket.io-client";
import { requestConfig } from "../config";
import { UserModelGetAll } from "../../slices/notificationUser.slice";

const { VITE_API_URL } = constantEnvs;
export const createSocketFactory = () => {
  let _socket: Socket;

  return async (): Promise<Socket> => {
    if (!_socket) {
      _socket = io(VITE_API_URL, {
        transports: ["websocket"],
        withCredentials: true,
      });
    }
    if (_socket.disconnected) {
      _socket.connect();
    }
    return _socket;
  };
};

const PREFIX = "/socket";

const getSocket = createSocketFactory();

export const SocketService = createApi({
  reducerPath: "socketApi",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    connectSocket: builder.query<UserModelGetAll, { userId?: number }>({
      query: (userId) => `/user/connect/${userId}`,
      async onCacheEntryAdded(
        { userId },
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData, dispatch }
      ) {
        const socket = await getSocket();
        
        try {
         if (!userId) return;

          await cacheDataLoaded;
        } catch (error) {
          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
    }),
  }),
});

/*

export const socketEmitAsPromise = (socket: Socket) => {
  return <TData = any>(message: string, data: TData): Promise<any> => {
    return new Promise((resolve, reject) => {
      socket.emit(message, data, (response: WsResponse<TData>) => {
        if (response.error) {
          reject(response);
        } else {
          resolve(response);
        }
      });
    });
  };
};

const getSocket = createSocketFactory();

export const eventChatApi = rootApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    sendMessage: builder.mutation<
      IEventChatMessageActivity,
      { message: string; eventId: string }
    >({
      queryFn: async (data) => {
        const socket = await getSocket();

        return socketEmitAsPromise(socket)(EventWsMessages.SEND_MESSAGE, data);
      },
      async onQueryStarted(data, { dispatch, queryFulfilled, getState }) {
        let me = userApi.endpoints.me.select()(getState()).data;

        if (!me) {
          me = await dispatch(userApi.endpoints.me.initiate()).unwrap();
        }

        const patchResult = dispatch(
          eventChatApi.util.updateQueryData(
            "readActivities",
            data.eventId,
            (draft) => {
              draft.push({
                id: nanoid(), // Thanks RTK for the nanoid export :P
                message: data.message,
                author: me!,
                eventId: data.eventId,
                type: EventChatActivitiesType.MESSAGE,
                updatedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
              });
            }
          )
        );

        try {
          // Since the response is a Promise now (see comment above socketEmitAsPromise), I can use queryFulfilled
          const result = await queryFulfilled;

          dispatch(
            eventApi.util.updateQueryData(
              "readAllEventsWhereImInvolved",
              undefined,
              (draft) => {
                const index = draft.findIndex(
                  (item) => item.id === data.eventId
                );

                if (index !== -1) {
                  draft[index].chatActivities = [result.data];
                }
              }
            )
          );
        } catch {
          patchResult.undo();

          toast.error(dispatch)("Une erreur est survenue.");

          dispatch(
            eventChatApi.util.invalidateTags([
              { type: "EventChatActivities", id: data.eventId },
            ])
          );
        }
      },
    }),
    readActivities: builder.query<IEventChatActivity[], string>({
      keepUnusedDataFor: 0,
      providesTags: (_, __, eventId) => [
        { type: "EventChatActivities", id: eventId },
      ],
      query: (eventId) => `events/${eventId}/chat-activities`,
      transformResponse(baseQueryReturnValue: IEventChatActivity[]) {
        return baseQueryReturnValue.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      },
      async onCacheEntryAdded(
        eventId,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const socket = await getSocket();

        // Add the items to the previous one fetched by the HTTP query at first
        const listener = (activity: IEventChatActivity) => {
          updateCachedData((draft) => {
            draft.push(activity);
          });
        };

        try {
          await cacheDataLoaded;

          socket.on(EventWsMessages.SEND_ACTIVITY_BACK, listener);
        } catch (err) {
          console.error(err);
        }

        await cacheEntryRemoved;

        socket.removeListener(EventWsMessages.SEND_ACTIVITY_BACK, listener);
      },
    }),
  }),
});
 */
