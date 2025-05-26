import { dtoValidator } from "@/core/utils";
import { z } from "zod";
import { userDto } from "./user.dto";
const createUserDtoSchema = z
  .object({
    roleId: z
      .number()
      .min(1, {
        message: "El campo roleId es requerido",
      })
      .int(),
  })
  .merge(userDto.getSchema.omit({ id: true }));

export type CreateUserDto = z.infer<typeof createUserDtoSchema>;

export const createUserDto = {
  create: (dto: CreateUserDto): [CreateUserDto?, string[]?] => {
    const errors = dtoValidator(dto, createUserDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  schema: createUserDtoSchema,
};
