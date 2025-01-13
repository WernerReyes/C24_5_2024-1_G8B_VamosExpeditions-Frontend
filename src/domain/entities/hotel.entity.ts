import { z } from "zod";
import { distritEntitySchema } from "./distrit.entity";
import { hotelRoomEntitySchema } from "./hotelRoom.entity";

export const hotelEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  address: z.string(),
  rating: z.number(),
  email: z.string(),
  hotelRooms: z.array(hotelRoomEntitySchema).optional(),
  distrit: z.object(distritEntitySchema.shape).optional(),
});

export type HotelEntity = z.infer<typeof hotelEntitySchema>;
