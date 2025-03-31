import { dtoValidator, generateEmptyObject } from "@/core/utils";
import {
  OrderType,
  TravelerStyle,
  TripDetailsEntity
} from "@/domain/entities";
import { z } from "zod";

const tripDetailsDtoSchema = z.object({
  versionQuotationId: z.object({
    quotationId: z.number(),
    versionNumber: z.number(),
  }),
  clientId: z.number(),
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

export type TripDetailsDto = z.infer<typeof tripDetailsDtoSchema>;

export const tripDetailsDto = {
  create: (tripDetailsDto: TripDetailsDto): [TripDetailsDto?, string[]?] => {
    const errors = dtoValidator(tripDetailsDto, tripDetailsDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [tripDetailsDto, undefined];
  },

  parse: (tripDetailsEntity: TripDetailsEntity): TripDetailsDto => {
    return {
      versionQuotationId: tripDetailsEntity.versionQuotation?.id!,
      clientId: tripDetailsEntity.client!.id,
      numberOfPeople: tripDetailsEntity.numberOfPeople,
      travelDates: [
       tripDetailsEntity.startDate,
       tripDetailsEntity.endDate,
      ],
      code: tripDetailsEntity.code,
      travelerStyle: tripDetailsEntity.travelerStyle,
      orderType: tripDetailsEntity.orderType,
      destination: tripDetailsEntity.cities ? tripDetailsEntity.cities.reduce(
        (acc, city) => ({ ...acc, [city.id]: true }),
        {}
      ) : {},
      specialSpecifications: tripDetailsEntity.specialSpecifications ?? "",
      id: tripDetailsEntity.id,
    };
  },

  getEmpty: generateEmptyObject<TripDetailsDto>(tripDetailsDtoSchema, {
    travelerStyle: TravelerStyle.COMFORT,
    orderType: OrderType.DIRECT,
  }),

  getSchema: tripDetailsDtoSchema,
};