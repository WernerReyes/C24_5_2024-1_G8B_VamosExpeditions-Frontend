import { generateEmptyObject, requestValidator } from "@/core/utils";
import {
  clientEntitySchema,
  type ClientEntity,
  OrderType,
  TravelerStyle,
  clientEntityEmpty,
} from "@/domain/entities";
import { z } from "zod";

export type ReservationDto = {
  readonly client: ClientEntity;
  readonly numberOfPeople: number;
  readonly travelDates: Date[];
  readonly code: string;
  readonly travelerStyle: TravelerStyle;
  readonly orderType: OrderType;
  readonly destination: { [key: number]: boolean };
  readonly specialSpecifications: string;
};

export const reservationDto = (
  client: ClientEntity,
  numberOfPeople: number,
  travelDates: Date[],
  code: string,
  travelerStyle: TravelerStyle,
  orderType: OrderType,
  destination: { [key: number]: boolean },
  specialSpecifications: string
) => {
  return {
    create: (): [ReservationDto?, string[]?] => {
      const errors = requestValidator(
        {
          client,
          numberOfPeople,
          travelDates,
          code,
          travelerStyle,
          orderType,
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
          client,
          numberOfPeople,
          travelDates,
          code,
          travelerStyle,
          orderType,
          destination,
          specialSpecifications,
        },
        undefined,
      ];
    },
  };
};

export const reservationDtoSchema = z.object({
  client: z.object(clientEntitySchema.shape, {
    required_error: "El campo cliente es requerido",
  }),
  numberOfPeople: z
    .number({
      message: "El campo número de personas es requerido",
    })
    .int({
      message: "El campo número de personas debe ser un número entero",
    })
    .positive({
      message: "El campo número de personas debe ser un número positivo",
    })
    .min(1, {
      message: "El campo número de personas es requerido",
    }),
  travelDates: z
    .array(z.date(), {
      required_error: "El campo fechas de viaje es requerido",
    })
    .length(2, {
      message: "El campo fechas de viaje debe tener al menos 2 elementos",
    }),
  code: z
    .string({
      message: "El campo código es requerido",
    })
    .min(1, {
      message: "El campo código es requerido",
    }),
  travelerStyle: z.nativeEnum(TravelerStyle, {
    required_error: "El campo estilo de viajero es requerido",
  }),
  orderType: z.nativeEnum(OrderType, {
    required_error: "El campo tipo de orden es requerido",
  }),
  destination: z.record(z.boolean(), {
    required_error: "El campo destino es requerido",
  }),
  specialSpecifications: z.string().min(1, {
    message: "El campo especificaciones especiales es requerido",
  }),
});

const defaultValues = {
  client: clientEntityEmpty,
  travelerStyle: TravelerStyle.COMFORT,
  orderType: OrderType.DIRECT,
};

export const reservationDtoEmpty = generateEmptyObject<ReservationDto>(
  reservationDtoSchema,
  defaultValues
);

