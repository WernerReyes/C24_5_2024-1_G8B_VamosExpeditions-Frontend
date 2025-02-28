import { z } from "zod";
import { hotelRoomEntitySchema } from "./hotelRoom.entity";
import { tripDetailsEntitySchema } from "./tripDetails.entity";

export const hotelRoomTripDetailsEntitySchema = z.object({
  id: z.number(),
  numberOfPeople: z.number(),
  date: z.date(),
  hotelRoom: z.object(hotelRoomEntitySchema.shape).optional(),
  tripDetails: z.object(tripDetailsEntitySchema.shape).optional(),
});

export type HotelRoomTripDetailsEntity = z.infer<
  typeof hotelRoomTripDetailsEntitySchema
>;
