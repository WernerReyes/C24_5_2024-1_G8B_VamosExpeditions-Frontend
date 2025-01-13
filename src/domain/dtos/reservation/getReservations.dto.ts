import { requestValidator } from "@/core/utils";
import { ReservationStatus } from "@/domain/entities";
import { z } from "zod";

export type GetReservationsDto = {
  readonly status?: ReservationStatus;
};

export const getReservationsDto = (status?: ReservationStatus) => {
  return {
    create: (): [GetReservationsDto?, string[]?] => {
      const errors = requestValidator(
        {
          status,
        },
        getReservationsDtoSchema
      );
      if (errors) return [undefined, errors];

      return [
        {
          status,
        },
        undefined,
      ];
    },
  };
};

export const getReservationsDtoSchema = z.object({
  status: z.optional(z.nativeEnum(ReservationStatus)),
});
