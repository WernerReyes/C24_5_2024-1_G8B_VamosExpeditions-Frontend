import { fromModelToString } from "@/core/utils";
import { z } from "zod";
import { cityModelSchemaPartial } from "./city.model";

export const tripDetailsHasCityModelSchemaPartial = z.object({
  trip_details_id: z.boolean().optional(),
  city_id: z.boolean().optional(),
});

export const tripDetailsHasCityModelSchema =
  tripDetailsHasCityModelSchemaPartial.merge(
    z.object({
      city: z
        .lazy(() =>
          z.object({
            ...cityModelSchemaPartial.shape,
          })
        )
        .optional(),
    })
  );

export type TripDetailsHasCityModel = z.infer<
  typeof tripDetailsHasCityModelSchema
>;

export const tripDetailsHasCityModel = {
  schema: tripDetailsHasCityModelSchema,
  toString: (tripDetailsHasCity?: TripDetailsHasCityModel): string =>
    fromModelToString(tripDetailsHasCity),
};
