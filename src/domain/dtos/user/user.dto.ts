import { z } from "zod";
import { generateEmptyObject, dtoValidator } from "@/core/utils";
import { regex } from "@/core/constants";
import { UserEntity } from "@/domain/entities";

const { EMAIL, PHONE } = regex;

const userDtoSchema = z.object({
  fullname: z.string().min(1, {
    message: "El campo nombre es requerido",
  }),
  email: z
    .string()
    .min(1, {
      message: "El campo email es requerido",
    })
    .regex(EMAIL, {
      message: "El campo email es inválido",
    }),
  phoneNumber: z
    .string()
    .regex(PHONE, {
      message: "El campo teléfono es inválido",
    })
    .optional(),
  description: z.string().optional(),

  id: z.number().optional().default(0),
});

export type UserDto = z.infer<typeof userDtoSchema>;

export const userDto = {
  create: (dto: UserDto): [UserDto?, string[]?] => {
    const errors = dtoValidator(dto, userDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },

  getDefault: (entity: UserEntity | null) => {
    if (entity) {
      return {
        id: entity.id,
        fullname: entity.fullname,
        email: entity.email,
        phoneNumber: entity.phoneNumber,
        description: entity.description,
      };
    }

    return generateEmptyObject<UserDto>(userDtoSchema, {
      id: 0,
    });
  },

  getSchema: userDtoSchema,
};
