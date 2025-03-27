import { dtoValidator } from "@/core/utils";
import { ReservationStatus } from "@/domain/entities";
import { z } from "zod";

const getReservationsDtoSchema = z.object({
  status: z.optional(z.nativeEnum(ReservationStatus)),
  quotationId: z.number().min(1).optional(),
  versionNumber: z.number().min(1).optional(),
});

export type GetReservationsDto = z.infer<typeof getReservationsDtoSchema>;

export const getReservationsDto = {
  create: (dto: GetReservationsDto): [GetReservationsDto?, string[]?] => {
    const errors = dtoValidator(dto, getReservationsDtoSchema);
    if (errors) return [undefined, errors];
    return [dto, undefined];
  },
  getSchema: getReservationsDtoSchema,
};
