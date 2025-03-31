import { dtoValidator } from "@/core/utils";
import { z } from "zod";

export const emailDtoSchema = z.object({
  subject: z.string().min(1, {
    message: "El campo asunto es requerido",
  }),
  to: z
    .array(
      z.object({
        email: z.string().email({
          message: "El campo email debe ser un correo válido",
        }),
        id: z.number().optional(),
      }),
      {
        required_error: "El campo para es requerido",
      }
    )
    .min(1, {
      message: "El campo para es requerido",
    }),
  resources: z
    .string({
      required_error: "El campo recursos es requerido",
    })
    .min(1, {
      message: "El campo recursos es requerido",
    }),
  resourcesId: z.number().optional(),
  description: z.string().optional(),
  reservationId: z.number().optional(),
});

export type EmailDto = z.infer<typeof emailDtoSchema>;

export const emailDto = {
  create: (dto: EmailDto): [EmailDto?, string[]?] => {
    const errors = dtoValidator(dto, emailDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
