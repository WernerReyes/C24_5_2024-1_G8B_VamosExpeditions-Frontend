import { dtoValidator } from "@/core/utils";
import { z } from "zod";

export const sendNotificationSchema = z.object({
  from_user: z.number().optional(),
  to_user: z
    .array(z.number())
    .min(1, { message: "Debes seleccionar al menos un destinatario" }),
  message: z.string().min(1, {
    message: "El campo mensaje es requerido",
  }),
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
  schema: sendNotificationSchema,
};
