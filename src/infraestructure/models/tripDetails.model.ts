import { fromModelToString } from "@/core/utils";
import { z } from "zod";
import { clientModelSchemaPartial } from "./client.model";
import { hotelRoomTripDetailsModelSchemaPartial } from "./hotelRoomTripDetails.model";
import { versionQuotationModelSchemaPartial } from "./versionQuotation.model";
import { tripDetailsHasCityModelSchemaPartial } from "./tripDetailsHasCity.model";

export const tripDetailsModelSchemaPartial = z.object({
  id: z.boolean().optional(),
  version_number: z.boolean().optional(),
  quotation_id: z.boolean().optional(),
  start_date: z.boolean().optional(),
  end_date: z.boolean().optional(),
  number_of_people: z.boolean().optional(),
  traveler_style: z.boolean().optional(),
  code: z.boolean().optional(),
  order_type: z.boolean().optional(),
  additional_specifications: z.boolean().optional(),
  client_id: z.boolean().optional(),
});

export const tripDetailsModelSchema = tripDetailsModelSchemaPartial.merge(
  z.object({
    client: z
      .lazy(() =>
        z.object({
          ...clientModelSchemaPartial.shape,
        })
      )
      .optional(),
    version_quotation: z
      .lazy(() =>
        z.object({
          ...versionQuotationModelSchemaPartial.shape,
        })
      )
      .optional(),
    hotel_room_trip_details: z
      .lazy(() =>
        z.array(
          z.object({
            ...hotelRoomTripDetailsModelSchemaPartial.shape,
          })
        )
      )
      .optional(),
    trip_details_has_city: z
      .lazy(() =>
        z.array(
          z.object({
            ...tripDetailsHasCityModelSchemaPartial.shape,
          })
        )
      )
      .optional(),
  })
);

export type TripDetailsModel = z.infer<typeof tripDetailsModelSchema>;

export const tripDetailsModel = {
  schema: tripDetailsModelSchema,
  toString: (tripDetails?: TripDetailsModel): string =>
    fromModelToString(tripDetails),
};
