import { fromModelToString } from "@/core/utils";
import { z } from "zod";
import { versionQuotationModelSchemaPartial } from "./versionQuotation.model";
import { reservationModelSchemaPartial } from "./reservation.model";

export const quotationModelSchemaPartial = z.object({
  id_quotation: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
});

export const quotationModelSchema = quotationModelSchemaPartial.merge(
  z.object({
    version_quotation: z
      .lazy(() =>
        z.object({
          ...versionQuotationModelSchemaPartial.shape,
        })
      )
      .optional(),
    reservation: z
      .lazy(() =>
        z.object({
          ...reservationModelSchemaPartial.shape,
        })
      )
      .optional(),
  })
);

export type QuotationModel = z.infer<typeof quotationModelSchema>;

export const quotationModel = {
  schema: quotationModelSchema,
  toString: (quotation?: QuotationModel): string =>
    fromModelToString(quotation),
};
