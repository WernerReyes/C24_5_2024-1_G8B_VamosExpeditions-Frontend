import { fromModelToString } from "@/core/utils";
import { z } from "zod";
import { countryModelSchemaPartial } from "./country.model";

export const cityModelSchemaPartial = z.object({
  id_city: z.boolean().optional(),
  name: z.boolean().optional(),
  country_id: z.boolean().optional(),
});

export const cityModelSchema = cityModelSchemaPartial.merge(
  z.object({
    country: z
      .lazy(() =>
        z.object({
          ...countryModelSchemaPartial.shape,
          city: z.array(z.lazy(() => cityModelSchemaPartial)).optional(),
        })
      )
      .optional(),
  })
);

export type CityModel = z.infer<typeof cityModelSchema>;

export const cityModel = {
  schema: cityModelSchema,
  toString: (city?: CityModel): string => fromModelToString(city),
};
