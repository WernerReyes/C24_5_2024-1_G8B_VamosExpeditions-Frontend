import { dtoValidator } from "@/core/utils";
import { z } from "zod";
import { HotelRoomType } from "../hotel";


export const roomDtoSchema = z.object({
  type: z.literal(HotelRoomType.ROOM),
  roomType: z
    .string()
    .min(1, { message: "El tipo de habitación es requerido" }),
  seasonType: z.string().min(1, { message: "La temporada es requerida" }),
  capacity: z.number().min(1, { message: "La capacidad es requerida" }),
  hotelId: z.number().min(1, { message: "El nombre del hotel es requerido" }),
  priceUsd: z.number().min(1, { message: "El precio en USD es requerido" }),
  serviceTax: z.number().min(1, { message: "El impuesto es requerido" }),
  rateUsd: z.number().min(1, { message: "La tarifa es requerida" }),
  pricePen: z.number().min(1, { message: "El precio en PEN es requerido" }),
  roomId: z.number().optional().default(0),
});

export type RoomDto = z.infer<typeof roomDtoSchema>;

export const roomDto = {
  create: (dto: RoomDto): [RoomDto | undefined, string[] | undefined] => {
    const errors = dtoValidator(dto, roomDtoSchema);
    if (errors) return [undefined, errors];

    return [dto, undefined];
  },

  getSchema: roomDtoSchema,
};
