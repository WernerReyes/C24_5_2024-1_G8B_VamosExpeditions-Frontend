import { dtoValidator } from "@/core/utils";
import { userModel } from "@/infraestructure/models/user.model";
import { z } from "zod";
import { paginationDtoSchema } from "../common";
import { RoleEnum } from "../../entities/role.entity";

const getUsersDtoSchema = z
  .object({
    fullname: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    role: z.array(z.nativeEnum(RoleEnum)).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    showDevices: z.boolean().default(false).optional(),
    isDeleted: z.boolean().default(false).optional(),
    select: z.lazy(() =>
      z.object({
        ...userModel.schema.shape,
      })
    ).optional(),

  })
  .merge(paginationDtoSchema);

export type GetUsersDto = z.infer<typeof getUsersDtoSchema>;

export const getUsersDto = {
  create: (dto: GetUsersDto): [GetUsersDto?, string[]?] => {
    const errors = dtoValidator(dto, getUsersDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  getSchema: getUsersDtoSchema,
};
