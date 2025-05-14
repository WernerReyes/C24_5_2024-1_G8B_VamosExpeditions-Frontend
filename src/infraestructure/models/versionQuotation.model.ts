import { fromModelToString } from "@/core/utils";
import { z } from "zod";
import { userModelSchemaPartial } from "./user.model";
import { tripDetailsModelSchemaPartial } from "./tripDetails.model";
import { quotationModelSchemaPartial } from "./quotation.model";
import { partnerModelSchemaPartial } from "./partner.model";
import { clientModelSchemaPartial } from "./client.model";
import { reservationModelSchemaPartial } from "./reservation.model";

export const versionQuotationModelSchemaPartial = z.object({
  version_number: z.boolean().optional(),
  quotation_id: z.boolean().optional(),
  indirect_cost_margin: z.boolean().optional(),
  name: z.boolean().optional(),
  profit_margin: z.boolean().optional(),
  final_price: z.boolean().optional(),
  official: z.boolean().optional(),
  user_id: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  status: z.boolean().optional(),
  completion_percentage: z.boolean().optional(),
  commission: z.boolean().optional(),
  partner_id: z.boolean().optional(),
  is_deleted: z.boolean().optional(),
  deleted_at: z.boolean().optional(),
  delete_reason: z.boolean().optional(),
});

export const versionQuotationModelSchema =
  versionQuotationModelSchemaPartial.merge(
    z.object({
      user: z
        .lazy(() => z.object({ ...userModelSchemaPartial.shape }))
        .optional(),
      trip_details: z
        .lazy(() =>
          z.object({
            ...tripDetailsModelSchemaPartial.shape,
            client: z
              .lazy(() => z.object({ ...clientModelSchemaPartial.shape }))
              .optional(),
          })
        )
        .optional(),
      quotation: z
        .lazy(() =>
          z.object({
            ...quotationModelSchemaPartial.shape,
            reservation: z
              .lazy(() =>
                z.object({
                  ...reservationModelSchemaPartial.shape,
                })
              )
              .optional(),
            version_quotation: z
              .lazy(() =>
                z.array(
                  z.object({ ...versionQuotationModelSchemaPartial.shape })
                )
              )
              .optional(),
          })
        )
        .optional(),
      partners: z
        .lazy(() => z.object({ ...partnerModelSchemaPartial.shape }))
        .optional(),
    })
  );

export type VersionQuotationModel = z.infer<typeof versionQuotationModelSchema>;

export const versionQuotationModel = {
  schema: versionQuotationModelSchema,
  toString: (versionQuotation?: VersionQuotationModel): string | undefined =>
    versionQuotation ? fromModelToString(versionQuotation) : undefined,
};
