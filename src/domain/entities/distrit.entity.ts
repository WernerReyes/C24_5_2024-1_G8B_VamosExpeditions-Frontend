import { z } from "zod";
import { cityEntitySchema } from "./city.entity";


export const distritEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  city: cityEntitySchema,
});

export type DistritEntity = z.infer<typeof distritEntitySchema>;