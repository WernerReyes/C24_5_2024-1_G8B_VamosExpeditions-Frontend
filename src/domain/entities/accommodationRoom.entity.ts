import { z } from "zod";
import { accommodationEntitySchema } from "./accommodation.entity";



export const accommodationRoomEntitySchema = z.object({
  id: z.number(),
  roomType: z.string(),
  priceUsd: z.number(),
  serviceTax: z.number(),
  rateUsd: z.number(),
  pricePen: z.number(),
  capacity: z.number(),
  available: z.boolean(),
  accommodation: accommodationEntitySchema,
  
});


export type AccommodationRoomEntity = z.infer<typeof accommodationRoomEntitySchema>;