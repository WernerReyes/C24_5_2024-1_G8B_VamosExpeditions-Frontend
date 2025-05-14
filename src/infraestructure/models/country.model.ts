import { z } from "zod";
import { cityModelSchemaPartial } from "./city.model";
import { fromModelToString } from "@/core/utils";

export const countryModelSchemaPartial = z.object({
  id_country: z.boolean().optional(),
  name: z.boolean().optional(),
  code: z.boolean().optional(),
});

export const countryModelSchema = countryModelSchemaPartial.merge(
  z.object({
    city: z.array(z.lazy(() => cityModelSchemaPartial)).optional(),
  })
);
export type CountryModel = z.infer<typeof countryModelSchema>;

export const countryModel = {
  schema: countryModelSchema,
  toString: (country?: CountryModel): string => fromModelToString(country),
};
