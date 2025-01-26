import { generateEmptyObject } from "@/core/utils";
import { type Subregion, SUBREGIONS } from "@/presentation/types";
import { z } from "zod";

export const clientEntitySchema = z.object({
  id: z.number().int().positive().min(1),
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  country: z.string(),
  subregion: z.string().refine((value): value is Subregion => {
    return SUBREGIONS.includes(value);
  }),
});

export type ClientEntity = z.infer<typeof clientEntitySchema>;

export const clientEntityEmpty =
  generateEmptyObject<ClientEntity>(clientEntitySchema);
