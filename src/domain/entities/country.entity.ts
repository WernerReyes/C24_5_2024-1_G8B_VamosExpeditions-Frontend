import { z } from "zod";
import { cityEntitySchema } from "./city.entity";

export const countryEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  cities: cityEntitySchema,
});

export type CountryEntity = z.infer<typeof countryEntitySchema>;
