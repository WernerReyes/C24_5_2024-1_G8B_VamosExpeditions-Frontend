import { generateEmptyObject } from "@/core/utils";
import { type Subregion, SUBREGIONS } from "@/presentation/types";
import { z } from "zod";

export const clientEntitySchema = z.object({
  id: z.number().int().positive().min(1),
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  country: z.object({
    name: z.string(),
    image: z.object({
      png: z.string(),
      svg: z.string(),
    }),
  }),
  subregion: z.string().refine((value): value is Subregion => {
    return SUBREGIONS.includes(value);
  }),
  cretedAt: z.string(),
  updatedAt: z.string(),
});

export type ClientEntity = z.infer<typeof clientEntitySchema>;

export const clientEntityEmpty =
  generateEmptyObject<ClientEntity>(clientEntitySchema);
