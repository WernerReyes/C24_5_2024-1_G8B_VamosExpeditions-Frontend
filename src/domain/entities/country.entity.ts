import { z } from "zod";

export const countryEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
});

export type CountryEntity = z.infer<typeof countryEntitySchema>;