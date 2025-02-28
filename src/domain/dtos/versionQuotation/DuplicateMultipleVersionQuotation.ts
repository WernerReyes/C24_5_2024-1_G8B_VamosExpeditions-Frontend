import { requestValidator } from "@/core/utils";
import { z } from "zod";

export type DuplicateMultipleVersionQuotationDto = {
  ids: {
    quotationId: number;
    versionNumber: number;
  }[];
};

export const duplicateMultipleVersionQuotationDto = {
  create: (
    dto: DuplicateMultipleVersionQuotationDto
  ): [DuplicateMultipleVersionQuotationDto?, string[]?] => {
    const errors = requestValidator(
      dto,

      duplicateMultipleVersionQuotationDtoSchema
    );
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};


export const duplicateMultipleVersionQuotationDtoSchema = z.object({
  ids: z.array(
    z.object({
      quotationId: z.number(),
      versionNumber: z.number(),
    })
  ),
});