import { requestValidator } from "@/core/utils";
import { z } from "zod";

export type EmailDto = {
  readonly subject: string;
  readonly to: string[];
  readonly resources: string;
  readonly description?: string;
};

export const emailDto = (
  subject: string,
  to: string[],
  resources: string,
  description?: string
) => {
  return {
    create: (): [EmailDto?, string[]?] => {
      const errors = requestValidator(
        {
          subject,
          to,
          resources,
          description,
        },
        emailDtoSchema
      );
      if (errors) {
        return [undefined, errors];
      }
      return [{ subject, to, resources, description }, undefined];
    },
  };
};

export const emailDtoSchema = z.object({
  subject: z.string().min(1, {
    message: "El campo asunto es requerido",
  }),
  to: z
    .array(z.string(), {
      required_error: "El campo para es requerido",
    })
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
  description: z.string().optional(),
});
