import { z } from "zod";
import { versionQuotationEntitySchema } from "./versionQuotation.entity";

const quotationEntitySchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  versions: z.array(versionQuotationEntitySchema).optional(),
});

export type QuotationEntity = z.infer<typeof quotationEntitySchema>;
