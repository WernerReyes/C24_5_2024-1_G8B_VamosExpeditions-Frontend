import { z } from "zod";



export const cityEntitySchema = z.object({
  id: z.number(),
  name: z.string(),

});

export type CityEntity = z.infer<typeof cityEntitySchema>;