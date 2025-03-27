import { dtoValidator } from "@/core/utils";
import { z } from "zod";
import { paginationDtoSchema } from "../common";
import { ReservationStatus } from "@/domain/entities";

const getReservationsDtoSchema = z
  .object({
    // status: z.optional(z.nativeEnum(ReservationStatus)),
    quotationId: z.number().min(1).optional(),
    versionNumber: z.number().min(1).optional(),
    status: z.nativeEnum(ReservationStatus).array().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),

  })
  .merge(paginationDtoSchema);

export type GetReservationsDto = z.infer<typeof getReservationsDtoSchema>;

export const getReservationsDto = {
  create: (dto: GetReservationsDto): [GetReservationsDto?, string[]?] => {
    const errors = dtoValidator(dto, getReservationsDtoSchema);
    if (errors) return [undefined, errors];
    return [dto, undefined];
  },
  getQueryParams: (dto: GetReservationsDto) =>
    new URLSearchParams(
      Object.entries({
        ...dto,
        quotationId: dto.quotationId?.toString(),
        versionNumber: dto.versionNumber?.toString(),
      }).reduce((acc, [key, value]) => {
        if (value !== undefined) acc[key] = value.toString();
        return acc;
      }, {} as Record<string, string>)
    ).toString(),
};
