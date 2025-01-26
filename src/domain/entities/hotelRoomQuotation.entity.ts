import { z } from "zod";
import { hotelRoomEntitySchema } from "./hotelRoom.entity";
import {
  VersionQuotationEntity,
  versionQuotationEntitySchema,
} from "./versionQuotation.entity";

export const hotelRoomQuotationEntitySchema = z.object({
  id: z.number(),
  day: z.number(),
  numberOfPeople: z.number(),
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
