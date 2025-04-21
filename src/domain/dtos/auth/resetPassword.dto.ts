import { regex } from "@/core/constants";
import { dtoValidator } from "@/core/utils";
import { z } from "zod";

const { PASSWORD } = regex;

const reserPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(1, {
      message: "El campo password es requerido",
    })
    .refine((value) => PASSWORD.test(value), {
      message:
        "Contraseña invalido, debe tener al menos 8 caracteres, una letra mayuscula, una letra minuscula y un numero",
    }),
  token: z.string().min(1, {
    message: "El token es requerido",
  }),
});

export type ResetPasswordDto = z.infer<typeof reserPasswordSchema>;

export const resetPasswordDto = {
  create: (dto: ResetPasswordDto): [ResetPasswordDto?, string[]?] => {
    const errors = dtoValidator(dto, reserPasswordSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  getSchema: reserPasswordSchema,
  getDefault: (dto: Partial<ResetPasswordDto> = {}): ResetPasswordDto => {
    return {
      newPassword: dto.newPassword ?? "",
      token: dto.token ?? "",
    };
  },
};
