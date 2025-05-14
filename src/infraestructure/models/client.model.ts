import { fromModelToString } from "@/core/utils";
import { z } from "zod";

export const clientModelSchemaPartial = z.object({
  id: z.boolean().optional(),
  fullName: z.boolean().optional(),
  country: z.boolean().optional(),
  subregion: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
});

export const clientModelSchema = clientModelSchemaPartial.merge(
  z.object({})
);

export type ClientModel = z.infer<typeof clientModelSchema>;

export const clientModel = {
  schema: clientModelSchema,
  toString: (client?: ClientModel): string => fromModelToString(client),
};


