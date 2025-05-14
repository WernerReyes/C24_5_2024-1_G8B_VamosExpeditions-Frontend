import { fromModelToString } from "@/core/utils";
import { z } from "zod";
import { userModelSchemaPartial } from "./user.model";

export const notificationModelSchemaPartial = z.object({
  id: z.boolean().optional(),
  from_user: z.boolean().optional(),
  to_user: z.boolean().optional(),
  message: z.boolean().optional(),
  is_read: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
});

export const notificationModelSchema = notificationModelSchemaPartial.merge(
  z.object({
    user_notification_from_userTouser: z
      .lazy(() => z.object({ ...userModelSchemaPartial.shape }))
      .optional(),
  })
);

export type NotificationModel = z.infer<typeof notificationModelSchema>;

export const notificationModel = {
  schema: notificationModelSchema,
  toString: (notification?: NotificationModel): string =>
    fromModelToString(notification),
};
