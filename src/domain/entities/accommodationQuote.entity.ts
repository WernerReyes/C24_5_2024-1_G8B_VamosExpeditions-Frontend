import { z } from "zod";
import { accommodationRoomEntitySchema } from "./accommodationRoom.entity";


export const accommodationQuoteEntitySchema = z.object({
  id: z.number(),
  accommodationRoom: z.lazy(() => accommodationRoomEntitySchema),
  customerNumber: z.number(),
  versionQuotation: z.null(),
  day: z.number(),
  date: z.string(),
});

export type AccommodationQuoteEntity = z.infer<typeof accommodationQuoteEntitySchema>;