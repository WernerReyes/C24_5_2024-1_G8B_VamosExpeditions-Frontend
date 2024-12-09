import { z } from "zod";
import { countryEntitySchema } from "./country.entity";


export const cityEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  country: countryEntitySchema,
});

export type CityEntity = z.infer<typeof cityEntitySchema>;