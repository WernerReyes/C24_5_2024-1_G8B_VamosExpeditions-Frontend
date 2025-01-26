import { z } from "zod";
import { distritEntitySchema } from "./distrit.entity";
import { hotelRoomEntitySchema } from "./hotelRoom.entity";

export enum HotelCategory {
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  BOUTIQUE = "BOUTIQUE",
  VILLA = "VILLA",
  LODGE = "LODGE",
}

export const hotelEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.nativeEnum(HotelCategory),
  address: z.string(),
  email: z.string(),
  hotelRooms: z.array(hotelRoomEntitySchema).optional(),
  distrit: z.object(distritEntitySchema.shape).optional(),
});

export type HotelEntity = z.infer<typeof hotelEntitySchema>;
