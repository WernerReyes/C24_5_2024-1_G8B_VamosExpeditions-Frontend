import { z } from "zod";
import { cityEntitySchema } from "./city.entity";

export const countryEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  image: z.object({
    png: z.string(),
    svg: z.string(),
  }).optional(),
  cities: z.array(cityEntitySchema).optional(),
});

export type CountryEntity = z.infer<typeof countryEntitySchema>;
