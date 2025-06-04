import { fromModelToString } from "@/core/utils";
import { z } from "zod";

export const partnerModelSchemaPartial = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  is_deleted: z.boolean().optional(),
  deleted_at: z.boolean().optional(),
  delete_reason: z.boolean().optional(),
  created_at: z.boolean().optional(),
});

export const partnerModelSchema = partnerModelSchemaPartial;

export type PartnerModel = z.infer<typeof partnerModelSchema>;

export const partnerModel = {
  schema: partnerModelSchema,
  toString: (partner?: PartnerModel): string => fromModelToString(partner),
};
