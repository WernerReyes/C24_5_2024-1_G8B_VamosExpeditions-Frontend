import { requestValidator } from "@/core/utils";
import { ReservationStatus } from "@/domain/entities";
import { z } from "zod";

export type GetReservationsDto = {
  readonly status?: ReservationStatus;
  readonly quotationId?: number;
  readonly versionNumber?: number;
};

const getReservationsDtoSchema = z.object({
  status: z.optional(z.nativeEnum(ReservationStatus)),
  quotationId: z.number().min(1).optional(),
  versionNumber: z.number().min(1).optional(),
});

export const getReservationsDto = {
  create: (dto: GetReservationsDto): [GetReservationsDto?, string[]?] => {
    const errors = requestValidator(dto, getReservationsDtoSchema);
    if (errors) return [undefined, errors];
    return [dto, undefined];
  },
  getSchema: getReservationsDtoSchema,
};
