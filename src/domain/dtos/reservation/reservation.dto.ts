import { generateEmptyObject, requestValidator } from "@/core/utils";
import {
  clientEntitySchema,
  type ClientEntity,
  OrderType,
  TravelerStyle,
  ReservationEntity,
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
  readonly id: number;
};

const reservationDtoSchema = z.object({
  client: z.object(clientEntitySchema.shape, {
    message: "El campo cliente es requerido",
    required_error: "El campo cliente es requerido",
  }).refine((value) => value.id !== 0, {
    message: "El campo cliente es requerido",
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
  destination: z.record(z.boolean({
    message: "El campo destino es requerido",
  }), {
    message: "El campo destino es requerido",
    required_error: "El campo destino es requerido",
  }).refine((value) => JSON.stringify(value) !== "{}", {
    message: "El campo destino es requerido",
  }),
  specialSpecifications: z.string().min(1, {
    message: "El campo especificaciones especiales es requerido",
  }),
  id: z.number(),
});

export const reservationDto = {
  create: (reservationDto: ReservationDto): [ReservationDto?, string[]?] => {
    const errors = requestValidator(reservationDto, reservationDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [reservationDto, undefined];
  },

  parse: (reservationEntity: ReservationEntity): ReservationDto => {
    return {
      client: reservationEntity.client!,
      numberOfPeople: reservationEntity.numberOfPeople,
      travelDates: [
        new Date(reservationEntity.startDate),
        new Date(reservationEntity.endDate),
      ],
      code: reservationEntity.code,
      travelerStyle: reservationEntity.travelerStyle,
      orderType: reservationEntity.orderType,
      destination: reservationEntity.cities!.reduce(
        (acc, city) => ({ ...acc, [city.id]: true }),
        {}
      ),
      specialSpecifications: reservationEntity.specialSpecifications ?? "",
      id: reservationEntity.id,
    };
  },

  getEmpty: generateEmptyObject<ReservationDto>(reservationDtoSchema, {
    travelerStyle: TravelerStyle.COMFORT,
    orderType: OrderType.DIRECT,
  }),

  getSchema: reservationDtoSchema,
};
