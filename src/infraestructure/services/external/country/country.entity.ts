import { z } from "zod";

export const externalCountryEntitySchema = z.object({
  name: z.string(),
  code: z.string(),
  image: z.object({
    png: z.string(),
    svg: z.string(),
  }),
  continent: z.string(),
});

export type ExternalCountryEntity = z.infer<typeof externalCountryEntitySchema>;
