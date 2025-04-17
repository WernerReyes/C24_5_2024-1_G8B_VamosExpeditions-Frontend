import { dtoValidator } from "@/core/utils";
import { z } from "zod";

export const sendNotificationSchema = z.object({
  from_user: z.number().optional(),
  to_user: z.array(z.number()),
  message: z.string(),
});

export type SendNotificationDto = z.infer<typeof sendNotificationSchema>;

export const sendNotificationDto = {
  create: (dto: SendNotificationDto): [SendNotificationDto?, string[]?] => {
    const errors = dtoValidator(dto, sendNotificationSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
