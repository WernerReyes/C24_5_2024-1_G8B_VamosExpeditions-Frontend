import { z } from "zod";
import { hotelRoomEntitySchema } from "./hotelRoom.entity";

export const hotelRoomQuotationEntitySchema = z.object({
  id: z.number(),
  numberOfPeople: z.number(),
  date: z.date(),
  hotelRoom: z.object(hotelRoomEntitySchema.shape).optional(),
  versionQuotation: z
    .object({
      quotationId: z.number(),
      versionNumber: z.number(),
    })
    .optional(),
});

export type HotelRoomQuotationEntity = z.infer<
  typeof hotelRoomQuotationEntitySchema
>;
