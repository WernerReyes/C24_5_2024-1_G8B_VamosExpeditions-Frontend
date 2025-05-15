import { dtoValidator } from "@/core/utils";
import { roleModel } from "@/infraestructure/models";
import { z } from "zod";
import { paginationDtoSchema } from "../common";

const getRolesDtoSchema = z
  .object({
    name: z.string().nullable().optional(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
    isDeleted: z.boolean().nullable().optional(),

    select: z
      .lazy(() =>
        z.object({
          ...roleModel.schema.shape,
        })
      )
      .optional(),
  })
  .merge(
    z.object({
      ...paginationDtoSchema.shape,
    })
  );

export type GetRolesDto = z.infer<typeof getRolesDtoSchema>;

export const getRolesDto = {
  create: (dto: GetRolesDto): [GetRolesDto?, string[]?] => {
    const errors = dtoValidator(dto, getRolesDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },

  getSchema: getRolesDtoSchema,
};
