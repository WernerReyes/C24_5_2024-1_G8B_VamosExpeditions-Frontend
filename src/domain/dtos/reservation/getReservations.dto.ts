import { dtoValidator } from "@/core/utils";
import { ReservationStatus } from "@/domain/entities";
import { reservationModel } from "@/infraestructure/models";
import { z } from "zod";
import { paginationDtoSchema } from "../common";

const getReservationsDtoSchema = z
  .object({
    quotationId: z.number().min(1).optional(),
    versionNumber: z.number().min(1).optional(),
    status: z.nativeEnum(ReservationStatus).array().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    select: z
      .lazy(() =>
        z.object({
          ...reservationModel.schema.shape,
        })
      )
      .optional(),
  })
  .merge(paginationDtoSchema);

export type GetReservationsDto = z.infer<typeof getReservationsDtoSchema>;

export const getReservationsDto = {
  create: (dto: GetReservationsDto): [GetReservationsDto?, string[]?] => {
    const errors = dtoValidator(dto, getReservationsDtoSchema);
    if (errors) return [undefined, errors];
    return [dto, undefined];
  },
};
