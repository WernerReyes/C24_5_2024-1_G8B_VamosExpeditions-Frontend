import { z } from "zod";
import { distritEntitySchema } from "./distrit.entity";

export const hotelRoomEntitySchema = z.object({
  id: z.number(),
  roomType: z.string(),
  priceUsd: z.number(),
  pricePen: z.number(),
  capacity: z.number(),
  hotel: z
    .object({
      id: z.number(),
      name: z.string(),
      category: z.string(),
      address: z.string(),
      email: z.string(),
      distrit: z.object(distritEntitySchema.shape).optional(),
    })
    .optional(),
});

export type HotelRoomEntity = z.infer<typeof hotelRoomEntitySchema>;
