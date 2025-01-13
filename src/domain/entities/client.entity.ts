import { generateEmptyObject } from "@/core/utils";
import type { Continent } from "@/presentation/types";
import { z } from "zod";

export const clientEntitySchema = z.object({
  id: z.number().int().positive().min(1),
  fullName: z.string(),
  email: z.string(),
  phone: z.string(),
  country: z.string(),
  continent: z.string().refine((value): value is Continent => {
    return [
      "Africa",
      "Antarctica",
      "Asia",
      "Europe",
      "Oceania",
      "South America",
      "North America",
    ].includes(value);
  }),
});


export type ClientEntity = z.infer<typeof clientEntitySchema>;

export const clientEntityEmpty = generateEmptyObject<ClientEntity>(clientEntitySchema);
