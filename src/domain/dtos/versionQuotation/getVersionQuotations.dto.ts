import { z } from "zod";
import { paginationDtoSchema } from "../common";
import { dtoValidator } from "@/core/utils";
import { VersionQuotationStatus } from "@/domain/entities";
import { versionQuotationModel } from "@/infraestructure/models";

const getVersionQuotationsDtoSchema = z
  .object({
    name: z.string().nullable().optional(),
    clientsIds: z.array(z.number()).nullable().optional(),
    startDate: z.date().nullable().optional(),
    endDate: z.date().nullable().optional(),
    representativesIds: z.array(z.number()).nullable().optional(),
    status: z.array(z.nativeEnum(VersionQuotationStatus)).nullable().optional(),
    quotationId: z.number().nullable().optional(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
    select: z.lazy(() => z.object({
      ...versionQuotationModel.schema.shape,
    })).optional(),
  })
  .merge(paginationDtoSchema);

export type GetVersionQuotationsDto = z.infer<
  typeof getVersionQuotationsDtoSchema
>;

export const getVersionQuotationsDto = {
  create: (
    dto: GetVersionQuotationsDto
  ): [GetVersionQuotationsDto?, string[]?] => {
    const errors = dtoValidator(dto, getVersionQuotationsDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
