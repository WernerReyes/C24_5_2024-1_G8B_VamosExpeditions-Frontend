import { dtoValidator } from "@/core/utils";
import { z } from "zod";

const trashDtoSchema = z.object({
  id: z.number().int().positive().or(z.object({
    quotationId: z.number().int().positive(),
    versionNumber: z.number().int().positive(),
  })),
  deleteReason: z.string().optional(),
});

export type TrashDto = z.infer<typeof trashDtoSchema>;

export const trashDto = {
  create: (dto: TrashDto): [TrashDto?, string[]?] => {
    const errors = dtoValidator(dto, trashDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
