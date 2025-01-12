// export class GetReservationsDto {
//     constructor(public readonly status?: ReservationStatus) {}

import { requestValidator } from "@/core/utils";
import { ReservationStatus } from "@/domain/entities";
import { z } from "zod";

//     static create(props: { [key: string]: any }): [string?, GetReservationsDto?] {
//       const { status } = props;

//       if (status) {
//         const errorStatus = Validations.validateEnumValue(
//           status,
//           Object.values(ReservationStatus)
//         );
//         if (errorStatus) return [errorStatus, undefined];
//       }

//       return [undefined, new GetReservationsDto(status)];
//     }
//   }

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
