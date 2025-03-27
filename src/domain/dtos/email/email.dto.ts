import { requestValidator } from "@/core/utils";
import { z } from "zod";

export type EmailDto = {
  readonly subject: string;
  readonly to: Array<{
  readonly id?: number;
  readonly email: string;
  }>;
  readonly resources: string;
  readonly description?: string;
  readonly reservationId?: number;
};

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
});

export const emailDto = {
  create: (dto: EmailDto): [EmailDto?, string[]?] => {
    const errors = requestValidator(dto, emailDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
