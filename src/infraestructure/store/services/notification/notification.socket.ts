import {
  sendNotificationDto,
  SendNotificationDto,
} from "@/domain/dtos/notification";
import { SocketManager } from "../socket/socket.service";
import { Dispatch } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import type { NotificationMessageEntity } from "@/domain/entities";
import { notificationCache } from "./notification.cache";
import { startShowSuccess } from "@/core/utils";

export const notificationSocket = {
  sendNotification: (notification: SendNotificationDto) => {
    try {
      const [_, errors] = sendNotificationDto.create(notification);
      if (errors) throw new Error(errors.join(", "));

      const socket = SocketManager.getInstance();
      if (!socket?.connected) {
        socket?.connect();
      }
      socket?.emit("personal-message", notification);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Error sending notification:", errorMessage);
    }
  },
};

export const notificationSocketListeners = (
  dispatch: Dispatch
  // getState: () => AppState
) => ({
  getPersonalMessages: (socket: Socket) => {
    socket?.on("personal-message", (data: NotificationMessageEntity) => {
      const audio = new Audio("/sounds/notification.mp3");
      audio.play();
      

      startShowSuccess(data.user?.fullname + " te ha enviado un mensaje");

      notificationCache.updateNotification(data, dispatch);
    });
  },
});
