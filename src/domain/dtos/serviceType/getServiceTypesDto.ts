import { dtoValidator } from "@/core/utils";
import { serviceTypeModel } from "@/infraestructure/models";
import { z } from "zod";
import { paginationDtoSchema } from "../common";

const getServiceTypesDtoSchema = z
  .object({
    select: z
      .lazy(() =>
        z.object({
          ...serviceTypeModel.schema.shape,
        })
      )
      .optional(),
  })
  .merge(paginationDtoSchema);

export type GetServiceTypesDto = z.infer<typeof getServiceTypesDtoSchema>;

export const getServiceTypesDto = {
  create: (dto: GetServiceTypesDto): [GetServiceTypesDto?, string[]?] => {
    const errors = dtoValidator(dto, getServiceTypesDtoSchema);
    if (errors) return [undefined, errors];
    return [dto, undefined];
  },
};
