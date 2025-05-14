import { fromModelToString } from "@/core/utils";
import { z } from "zod";
import { hotelRoomModelSchemaPartial } from "./hotelRoom.model";
import { tripDetailsModelSchemaPartial } from "./tripDetails.model";

export const hotelRoomTripDetailsModelSchemaPartial = z.object({
  id: z.boolean().optional(),
  hotel_room_id: z.boolean().optional(),
  date: z.boolean().optional(),
  trip_details_id: z.boolean().optional(),
  cost_person: z.boolean().optional(),
});

export const hotelRoomTripDetailsModelSchema =
  hotelRoomTripDetailsModelSchemaPartial.merge(
    z.object({
      hotel_room: z
        .lazy(() =>
          z.object({
            ...hotelRoomModelSchemaPartial.shape,
          })
        )
        .optional(),
      trip_details: z.lazy(() =>
        z
          .object({
            ...tripDetailsModelSchemaPartial.shape,
          })
          .optional()
      ),
    })
  );

export type HotelRoomTripDetailsModel = z.infer<
  typeof hotelRoomTripDetailsModelSchema
>;

export const hotelRoomTripDetailsModel = {
  schema: hotelRoomTripDetailsModelSchema,
  toString: (hotelRoomTripDetails?: HotelRoomTripDetailsModel): string =>
    fromModelToString(hotelRoomTripDetails),
};
