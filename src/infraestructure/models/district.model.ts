import { fromModelToString } from "@/core/utils";
import { z } from "zod";
import { cityModelSchemaPartial } from "./city.model";
import { countryModelSchemaPartial } from "./country.model";

export const districtModelSchemaPartial = z.object({
  id_distrit: z.boolean().optional(),
  name: z.boolean().optional(),
  city_id: z.boolean().optional(),
});

export const districtModelSchema = districtModelSchemaPartial.merge(
  z.object({
    city: z
      .lazy(() =>
        z
          .object({
            ...cityModelSchemaPartial.shape,
          })
          .optional()
          .and(
            z.object({
              country: z.lazy(() =>
                z
                  .object({
                    ...countryModelSchemaPartial.shape,
                  })
                  .optional()
              ),
            })
          )
      )
      .optional(),
  })
);

export type DistrictModel = z.infer<typeof districtModelSchema>;

export const districtModel = {
  schema: districtModelSchema,
  toString: (district?: DistrictModel): string => fromModelToString(district),
};
