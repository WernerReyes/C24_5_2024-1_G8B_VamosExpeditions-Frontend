import { z } from "zod";


export const cityEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  country: z.object({
    id: z.number(),
    name: z.string(),
    code: z.string()
  }).optional()
});

export type CityEntity = z.infer<typeof cityEntitySchema>;