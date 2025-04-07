import { SocketManager } from "../socket/socket.service";

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
