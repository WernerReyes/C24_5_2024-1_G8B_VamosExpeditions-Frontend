import { z } from "zod";
import { distritEntitySchema } from "./distrit.entity";

export const accommodationEntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  address: z.string(),
  rating: z.number(),
  email: z.string(),
  distrit: distritEntitySchema,
});

export type AccommodationEntity = z.infer<typeof accommodationEntitySchema>;