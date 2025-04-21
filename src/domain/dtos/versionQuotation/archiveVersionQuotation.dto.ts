import { dtoValidator } from "@/core/utils";
import { z } from "zod";

const archiveVersionQuotationDtoSchema = z.object({
  id: z.object({
    quotationId: z.number().int(),
    versionNumber: z.number().int(),
  }),
  archiveReason: z.string().optional(),
  official: z.boolean().optional(),
});

export type ArchiveVersionQuotationDto = z.infer<
  typeof archiveVersionQuotationDtoSchema
>;

export const archiveVersionQuotationDto = {
  create: (
    dto: ArchiveVersionQuotationDto
  ): [ArchiveVersionQuotationDto?, string[]?] => {
    const errors = dtoValidator(dto, archiveVersionQuotationDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
