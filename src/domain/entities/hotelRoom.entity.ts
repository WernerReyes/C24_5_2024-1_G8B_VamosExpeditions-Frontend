import { z } from "zod";
import { distritEntitySchema } from "./distrit.entity";

export const hotelRoomEntitySchema = z.object({
  id: z.number(),
  roomType: z.string(),
  capacity: z.number(),
  seasonType: z.string().optional(),
  serviceTax: z.number().optional(),
  rateUsd: z.number().optional(),
  priceUsd: z.number().optional(),
  pricePen: z.number().optional(),
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
