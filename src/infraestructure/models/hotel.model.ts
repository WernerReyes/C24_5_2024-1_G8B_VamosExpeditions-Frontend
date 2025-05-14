import { fromModelToString } from "@/core/utils";
import { z } from "zod";
import { districtModelSchemaPartial } from "./district.model";
import { hotelRoomModelSchemaPartial } from "./hotelRoom.model";

export const hotelModelSchemaPartial = z.object({
  id_hotel: z.boolean().optional(),
  name: z.boolean().optional(),
  distrit_id: z.boolean().optional(),
  category: z.boolean().optional(),
  address: z.boolean().optional(),
});

export const hotelModelSchema = hotelModelSchemaPartial.merge(
  z.object({
    distrit: z
      .lazy(() =>
        z.object({
          ...districtModelSchemaPartial.shape,
        })
      )
      .optional(),
    hotel_room: z
      .array(z.lazy(() => hotelRoomModelSchemaPartial).optional())
      .optional(),
  })
);

export type HotelModel = z.infer<typeof hotelModelSchema>;

export const hotelModel = {
  schema: hotelModelSchema,
  toString: (hotel?: HotelModel): string => fromModelToString(hotel),
};
