import { regex } from "@/core/constants";
import { dtoValidator } from "@/core/utils";
import type { UserEntity } from "@/domain/entities";
import { z } from "zod";

const { PASSWORD } = regex;

const changePasswordDtoSchema = z.object({
  id: z.number().min(1, {
    message: "El campo id es requerido",
  }),

  oldPassword: z
    .string()
    .min(1, {
      message: "El campo password es requerido",
    })
    .refine((value) => PASSWORD.test(value), {
      message:
        "Contraseña invalido, debe tener al menos 8 caracteres, una letra mayuscula, una letra minuscula y un numero",
    }),
  newPassword: z

    .string()
    .min(1, {
      message: "El campo password es requerido",
    })
    .refine((value) => PASSWORD.test(value), {
      message:
        "Contraseña invalido, debe tener al menos 8 caracteres, una letra mayuscula, una letra minuscula y un numero",
    }),
});
export type ChangePasswordDto = z.infer<typeof changePasswordDtoSchema>;

export const changePasswordDto = {
  create: (dto: ChangePasswordDto): [ChangePasswordDto?, string[]?] => {
    const errors = dtoValidator(dto, changePasswordDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  getSchema: changePasswordDtoSchema,
  getDefault: (userEntity: Partial<UserEntity>): ChangePasswordDto => {
    return {
      id: userEntity.id || 0,
      oldPassword: "",
      newPassword: "",
    };
  },
};
