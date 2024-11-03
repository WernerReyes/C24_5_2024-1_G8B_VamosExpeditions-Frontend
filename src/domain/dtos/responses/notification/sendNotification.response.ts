import type { NotificationData } from "@/model";

export type SendNotificationResponse<T> = {
  notification: T;
  data: NotificationData;
};
