import { dtoValidator } from "@/core/utils";
import { z } from "zod";

const archiveReservationDtoSchema = z.object({
  id: z.number().int().positive(),
  archiveReason: z.string().optional(),
});

export type ArchiveReservationDto = z.infer<typeof archiveReservationDtoSchema>;

export const archiveReservationDto = {
  create: (dto: ArchiveReservationDto): [ArchiveReservationDto?, string[]?] => {
    const errors = dtoValidator(dto, archiveReservationDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
