import { z } from "zod";
import { reservationEntitySchema } from "./reservation.entity";
import { userEntitySchema } from "./user.entity";
import { hotelRoomQuotationEntitySchema } from "./hotelRoomQuotation.entity";

export enum VersionQuotationStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const versionQuotationEntitySchema = z.object({
  id: z.object({ quotationId: z.number(), versionNumber: z.number() }),
  name: z.string(),
  status: z.nativeEnum(VersionQuotationStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
  official: z.boolean(),
  indirectCostMargin: z.number().optional(),
  profitMargin: z.number().optional(),
  totalCost: z.number().optional(),
  finalPrice: z.number().optional(),
  hotelRoomQuotations: z.array(hotelRoomQuotationEntitySchema).optional(),
  reservation: z.object(reservationEntitySchema.shape).optional(),
  user: z.object(userEntitySchema.shape).optional(),
});

export type VersionQuotationEntity = z.infer<
  typeof versionQuotationEntitySchema
>;
