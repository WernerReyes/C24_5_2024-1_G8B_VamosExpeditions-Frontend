import { requestValidator } from "@/core/utils";
import { z } from "zod";

export type ReservationDto = {
  readonly clientId: number;
  readonly numberOfPeople: string;
  readonly travelDates: Date[];
  readonly code: string;
  readonly comfortClass: string;
  readonly destination: { [key: number]: boolean };
  readonly specialSpecifications: string;
};

export const reservationRequest = (
  clientId: number,
  numberOfPeople: string,
  travelDates: Date[],
  code: string,
  comfortClass: string,
  destination: { [key: number]: boolean },
  specialSpecifications: string
) => {
  return {
    create: (): [ReservationDto?, string[]?] => {
      const errors = requestValidator(
        {
          clientId,
          numberOfPeople,
          travelDates,
          code,
          comfortClass,
          destination,
          specialSpecifications,
        },
        reservationDtoSchema
      );
      if (errors) {
        return [undefined, errors];
      }
      return [
        {
          clientId,
          numberOfPeople,
          travelDates,
          code,
          comfortClass,
          destination,
          specialSpecifications,
        },
        undefined,
      ];
    },
  };
};

export const reservationDtoSchema = z.object({
  clientId: z
    .number({
      required_error: "El campo id de cliente es requerido",
    })
    .int()
    .min(1),
  numberOfPeople: z.string().min(1, {
    message: "El campo numero de personas es requerido",
  }),
  travelDates: z.array(z.date(), {
    required_error: "El campo fechas de viaje es requerido",
  }),
  code: z
    .string({
      required_error: "El campo código es requerido",
    })
    .min(1),
  comfortClass: z.string().min(1, {
    message: "El campo clase de confort es requerido",
  }),
  destination: z.record(z.boolean(), {
    required_error: "El campo destino es requerido",
  }),
  specialSpecifications: z.string().min(1, {
    message: "El campo especificaciones especiales es requerido",
  }),
});
