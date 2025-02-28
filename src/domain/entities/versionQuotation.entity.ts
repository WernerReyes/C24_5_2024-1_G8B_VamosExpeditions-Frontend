import { z } from "zod";

import { cityEntitySchema } from "./city.entity";
import { clientEntitySchema } from "./client.entity";
import { OrderType, TravelerStyle } from "./tripDetails.entity";
import { userEntitySchema } from "./user.entity";

export enum VersionQuotationStatus {
  DRAFT = "DRAFT",
  COMPLETED = "COMPLETED",
  CANCELATED = "CANCELATED",
}

type VersionQuotationStatusRender = {
  label: string;
  icon: string;
  severity: "info" | "warning" | "success";
};

export const versionQuotationRender: Record<
  VersionQuotationStatus,
  VersionQuotationStatusRender
> = {
  [VersionQuotationStatus.DRAFT]: {
    label: "Borrador",
    severity: "info",
    icon: "pi pi-pencil",
  },
  [VersionQuotationStatus.COMPLETED]: {
    label: "Completado",
    severity: "success",
    icon: "pi pi-check",
  },
  [VersionQuotationStatus.CANCELATED]: {
    label: "Cancelado",
    severity: "warning",
    icon: "pi pi-times",
  },
};

export const versionQuotationEntitySchema = z.object({
  id: z.object({ quotationId: z.number(), versionNumber: z.number() }),
  name: z.string(),
  status: z.nativeEnum(VersionQuotationStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
  official: z.boolean(),
  completionPercentage: z.number(),
  indirectCostMargin: z.number().optional(),
  profitMargin: z.number().optional(),
  finalPrice: z.number().optional(),
  quotation: z.object({ id: z.number() }),
  tripDetails: z
    .object({
      id: z.number().int().positive().min(1),
      numberOfPeople: z.number(),
      startDate: z.date(),
      endDate: z.date(),
      code: z.string(),
      travelerStyle: z.nativeEnum(TravelerStyle),
      orderType: z.nativeEnum(OrderType),
      specialSpecifications: z.string().optional(),

      client: z.object(clientEntitySchema.shape).optional(),
      cities: z.array(cityEntitySchema).optional(),
    })
    .optional(),
  user: z.object(userEntitySchema.shape).optional(),
});

export type VersionQuotationEntity = z.infer<
  typeof versionQuotationEntitySchema
>;
