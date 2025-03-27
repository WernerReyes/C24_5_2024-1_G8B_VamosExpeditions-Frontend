import { dtoValidator } from "@/core/utils";
import { ReservationStatus } from "@/domain/entities";
import { z } from "zod";

const reservationDtoSchema = z.object({
  quotationId: z.number().int().positive().min(1),
  id: z.number().optional().default(0),
  status: z
    .nativeEnum(ReservationStatus)
    .optional()
    .default(ReservationStatus.PENDING),
});

export type ReservationDto = z.infer<typeof reservationDtoSchema>;

export const reservationDto = {
  create: (reservationDto: ReservationDto): [ReservationDto?, string[]?] => {
    const errors = dtoValidator(reservationDto, reservationDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [reservationDto, undefined];
  },

  getSchema: reservationDtoSchema,
};
