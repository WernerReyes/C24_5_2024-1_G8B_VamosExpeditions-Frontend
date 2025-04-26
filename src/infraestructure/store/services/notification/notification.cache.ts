import type { AppDispatch } from "@/app/store";
import type { NotificationMessageEntity } from "@/domain/entities";
import { notificationService } from "./notification.service";

export const notificationCache = {
  updateNotification: (
    data: NotificationMessageEntity,
    dispatch: AppDispatch
  ) => {
    dispatch(
      // Corrected the typo in 'dispach'
      notificationService.util.updateQueryData(
        "getAllNotifications",
        undefined,
        (draft) => {
          // Modify the draft as needed, e.g., updating the notification data
          Object.assign(draft, [data, ...draft]);
        }
      )
    );
  },

  deleteNotification: (ids: number[], dispatch: AppDispatch) => {
    dispatch(
      notificationService.util.updateQueryData(
        "getAllNotifications",
        undefined,
        (draft) => {
          // Filter out the deleted notifications from the draft
          return draft.filter((notification: NotificationMessageEntity) => {
            return !ids.includes(notification.id);
          });
        }
      )
    );
  },

  markNotificationAsRead: (ids: number[], dispatch: AppDispatch) => {
    dispatch(
      notificationService.util.updateQueryData(
        "getAllNotifications",
        undefined,
        (draft) => {
          // Update the read status of the notifications in the draft
          return draft.map((notification: NotificationMessageEntity) => {
            if (ids.includes(notification.id)) {
              return { ...notification, is_read: true };
            }
            return notification;
          });
        }
      )
    );
  },
};
