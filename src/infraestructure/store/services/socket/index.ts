import { constantEnvs } from "@/core/constants/env.const";
import { createApi } from "@reduxjs/toolkit/query/react";
import { io, Socket } from "socket.io-client";
import { requestConfig } from "../config";

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

// export const SocketService = createApi({
//   reducerPath: "socketApi",
//   baseQuery: requestConfig(PREFIX),
//   endpoints: (builder) => ({
//     connectSocket: builder.query<any, { userId?: number }>({
//       query: (userId) => `/user/connect/${userId}`,
//       async onCacheEntryAdded(
//         { userId },
//         { cacheDataLoaded, cacheEntryRemoved }
//       ) {
//         const socket = await getSocket();

//         try {
//           if (!userId) return;

//           await cacheDataLoaded;
//         } catch (error) {
//           await cacheEntryRemoved;
//           socket.disconnect();
//         }
//       },
//     }),
//   }),
// });
