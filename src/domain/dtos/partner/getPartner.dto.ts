import { dtoValidator } from "@/core/utils";
import { z } from "zod";

import { partnerModel } from "@/infraestructure/models/partner.model"; // Asegúrate de tener este archivo
import { paginationDtoSchema } from "../common";

const getPartnersDtoSchema = z
  .object({
    id: z.number().int().positive().optional(),
    name: z.string().optional(),
    created_at: z.boolean().optional(),
    updatedAt: z.date().optional(),
    deletedAt: z.date().optional(),
    isDeleted: z.boolean().optional(),
    deleteReason: z.string().optional(),
    select: z
      .lazy(() =>
        z.object({
          ...partnerModel.schema.shape,
        })
      )
      .optional(),
  })
  .merge(paginationDtoSchema);

export type GetPartnersDto = z.infer<typeof getPartnersDtoSchema>;

export const getPartnersDto = {
  create: (dto: GetPartnersDto): [GetPartnersDto?, string[]?] => {
    const errors = dtoValidator(dto, getPartnersDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  getSchema: getPartnersDtoSchema,
};
