import { z } from "zod";

export const hotelRoomEntitySchema = z.object({
  id: z.number(),
  roomType: z.string(),
  priceUsd: z.number(),
  serviceTax: z.number(),
  rateUsd: z.number(),
  pricePen: z.number(),
  capacity: z.number(),
  available: z.boolean(),
});

export type HotelRoomEntity = z.infer<typeof hotelRoomEntitySchema>;
