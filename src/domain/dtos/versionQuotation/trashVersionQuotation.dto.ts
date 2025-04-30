import { dtoValidator } from "@/core/utils";
import { z } from "zod";

const trashVersionQuotationDtoSchema = z.object({
  id: z.object({
    quotationId: z.number().int(),
    versionNumber: z.number().int(),
  }),
  deleteReason: z.string().optional(),
});

export type TrashVersionQuotationDto = z.infer<
  typeof trashVersionQuotationDtoSchema
>;

export const trashVersionQuotationDto = {
  create: (
    dto: TrashVersionQuotationDto
  ): [TrashVersionQuotationDto?, string[]?] => {
    const errors = dtoValidator(dto, trashVersionQuotationDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
