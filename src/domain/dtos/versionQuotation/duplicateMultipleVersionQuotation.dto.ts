import { dtoValidator } from "@/core/utils";
import { z } from "zod";

export const duplicateMultipleVersionQuotationDtoSchema = z.object({
  ids: z.array(
    z.object({
      quotationId: z.number(),
      versionNumber: z.number(),
    })
  ),
});

export type DuplicateMultipleVersionQuotationDto = z.infer<
  typeof duplicateMultipleVersionQuotationDtoSchema
>;

export const duplicateMultipleVersionQuotationDto = {
  create: (
    dto: DuplicateMultipleVersionQuotationDto
  ): [DuplicateMultipleVersionQuotationDto?, string[]?] => {
    const errors = dtoValidator(
      dto,

      duplicateMultipleVersionQuotationDtoSchema
    );
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
