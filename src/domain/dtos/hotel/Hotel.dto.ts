import { dtoValidator } from "@/core/utils";

import { z } from "zod";

export enum HotelRoomType {
  HOTEL = "HOTEL",
  ROOM = "ROOM",
  HOTELANDROOM = "HOTELANDROOM",
}

export enum HotelCategory {
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  BOUTIQUE = "BOUTIQUE",
  VILLA = "VILLA",
  LODGE = "LODGE",
}

export const hotelDtoSchema = z.object({
  type: z.literal(HotelRoomType.HOTEL),
  category: z.nativeEnum(HotelCategory, {message: "La categoría es requerida"}),
  name: z.string().min(1, { message: "El nombre del hotel es requerido" }),
  address: z.string().min(1, { message: "La dirección es requerida" }),
  distrit: z.number().min(1, { message: "El distrito es requerido" }),
  id: z.number().optional().default(0),
  
});


export const registerRoomDtoSchema = z.object({
  type: z.literal(HotelRoomType.ROOM),
  roomType: z
    .string()
    .min(1, { message: "El tipo de habitación es requerido" }),
  season: z.string().min(1, { message: "La temporada es requerida" }),
  hotelName: z.string().min(1, { message: "El nombre del hotel es requerido" }),
  priceUsd: z
    .string()
    .min(1, { message: "El precio en USD es requerido" })
    .refine((val) => !isNaN(Number(val)), {
      message: "El precio debe ser un número",
    }),
  serviceTax: z
    .string()
    .min(1, { message: "El impuesto es requerido" })
    .refine((val) => !isNaN(Number(val)), {
      message: "El impuesto debe ser un número",
    }),
  rateUsd: z
    .string()
    .min(1, { message: "La tarifa es requerida" })
    .refine((val) => !isNaN(Number(val)), {
      message: "La tarifa debe ser un número",
    }),
  pricePen: z
    .string()
    .min(1, { message: "El precio en PEN es requerido" })
    .refine((val) => !isNaN(Number(val)), {
      message: "El precio debe ser un número",
    }),
});

export const registerHotelDtoandRoomDtoSchema = z
  .object({ type: z.literal(HotelRoomType.HOTELANDROOM) })
  .merge(hotelDtoSchema.omit({ type: true }))
  .merge(registerRoomDtoSchema.omit({ type: true }));

export const combinedSchema = z.discriminatedUnion("type", [
  hotelDtoSchema,
  registerRoomDtoSchema,
  registerHotelDtoandRoomDtoSchema,
]);

/// DTOs
export type HotelRoomDto = z.infer<typeof registerRoomDtoSchema>;
export type HotelDto = z.infer<typeof hotelDtoSchema>;

//Union type for all DTOs
export type HotelRoomDtoUnion = z.infer<typeof combinedSchema>;

//Dto for Hotel and Room
export const registerDto = {
  create: (
    dto: HotelRoomDtoUnion
  ): [HotelRoomDtoUnion | undefined, string[] | undefined] => {
    const errors = dtoValidator(dto, combinedSchema);
    if (errors) {
      return [undefined, errors];
    }

    return [dto, undefined];
  },

  

  getSchema: combinedSchema,
};


/// DTOs for Hotel 
export const hotelDto ={
  create: (
    dto: HotelDto
  ): [HotelDto | undefined, string[] | undefined] => {
    const errors = dtoValidator(dto, hotelDtoSchema);
    if (errors) {
      return [undefined, errors];
    }

    return [dto, undefined];
  },


  getSchema: hotelDtoSchema,
}