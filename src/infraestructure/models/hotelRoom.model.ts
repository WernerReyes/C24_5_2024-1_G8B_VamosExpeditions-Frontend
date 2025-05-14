import { fromModelToString } from "@/core/utils";
import { z } from "zod";
import { hotelModelSchemaPartial } from "./hotel.model";

export const hotelRoomModelSchemaPartial = z.object({
  id_hotel_room: z.boolean().optional(),
  room_type: z.boolean().optional(),
  season_type: z.boolean().optional(),
  price_usd: z.boolean().optional(),
  service_tax: z.boolean().optional(),
  rate_usd: z.boolean().optional(),
  price_pen: z.boolean().optional(),
  capacity: z.boolean().optional(),
  hotel_id: z.boolean().optional(),
});

export const hotelRoomModelSchema = hotelRoomModelSchemaPartial.merge(
  z.object({
    hotel: z
      .lazy(() =>
        z.object({
          ...hotelModelSchemaPartial.shape,
        })
      )
      .optional(),
  })
);

export type HotelRoomModel = z.infer<typeof hotelRoomModelSchema>;

export const hotelRoomModel = {
  schema: hotelRoomModelSchema,
  toString: (hotelRoom?: HotelRoomModel): string => fromModelToString(hotelRoom),
};