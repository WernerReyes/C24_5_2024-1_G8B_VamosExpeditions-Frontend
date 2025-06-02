import { dtoValidator } from "@/core/utils";
import { serviceModel } from "@/infraestructure/models";
import { z } from "zod";
import { paginationDtoSchema } from "../common";

const getServicesDtoSchema = z
  .object({
    cityId: z.number().min(1).optional(),
    serviceTypeId: z.number().min(1).optional(),
    select: z
      .lazy(() =>
        z.object({
          ...serviceModel.schema.shape,
        })
      )
      .optional(),
  })
  .merge(paginationDtoSchema);

export type GetServicesDto = z.infer<typeof getServicesDtoSchema>;

export const getServicesDto = {
  create: (dto: GetServicesDto): [GetServicesDto?, string[]?] => {
    const errors = dtoValidator(dto, getServicesDtoSchema);
    if (errors) return [undefined, errors];
    return [dto, undefined];
  },
};