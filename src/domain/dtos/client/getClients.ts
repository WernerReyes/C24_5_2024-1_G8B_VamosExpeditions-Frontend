import { z } from "zod";
import { dtoValidator } from "@/core/utils";
 // asegúrate que el modelo tenga `.schema.shape`
import { paginationDtoSchema } from "../common";
import { clientModel } from "@/infraestructure/models";

const getClientsDtoSchema = z
  .object({
    fullName: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    subregion: z.string().optional(),
    country: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    isDeleted: z.boolean().optional(),
    select: z.lazy(() =>
      z.object({
        ...clientModel.schema.shape,
      })
    ).optional(),
  })
  .merge(paginationDtoSchema);

export type GetClientsDto = z.infer<typeof getClientsDtoSchema>;

export const getClientsDto = {
  create: (dto: GetClientsDto): [GetClientsDto?, string[]?] => {
    const errors = dtoValidator(dto, getClientsDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  getSchema: getClientsDtoSchema,
};
