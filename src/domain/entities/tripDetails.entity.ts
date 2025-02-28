import { z } from "zod";
import { clientEntitySchema } from "./client.entity";
import { cityEntitySchema } from "./city.entity";
import { generateEmptyObject } from "@/core/utils";
import type { Severity } from "@/presentation/types";
import { versionQuotationEntitySchema } from "./versionQuotation.entity";

export enum TravelerStyle {
  STANDARD = "STANDARD",
  COMFORT = "COMFORT",
  LUXUS = "LUXUS",
}

export const travelerStyleRender: Record<
  TravelerStyle,
  { label: string; severity: Severity }
> = {
  STANDARD: {
    label: "Estándar",
    severity: "info",
  },
  COMFORT: {
    label: "Confort",
    severity: "warning",
  },
  LUXUS: {
    label: "Lujo",
    severity: "success",
  },
};

export enum OrderType {
  DIRECT = "DIRECT",
  INDIRECT = "INDIRECT",
}

export const orderTypeRender: Record<
  OrderType,
  { label: string; severity: Severity }
> = {
  DIRECT: {
    label: "Directo",
    severity: "info",
  },
  INDIRECT: {
    label: "Indirecto",
    severity: "warning",
  },
};

export const tripDetailsEntitySchema = z.object({
  id: z.number().int().positive().min(1),
  numberOfPeople: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  code: z.string(),
  travelerStyle: z.nativeEnum(TravelerStyle),
  orderType: z.nativeEnum(OrderType),
  specialSpecifications: z.string().optional(),
  versionQuotation: z.object(versionQuotationEntitySchema.shape).optional(),
  client: z.object(clientEntitySchema.shape).optional(),
  cities: z.array(cityEntitySchema).optional(),
});

export type TripDetailsEntity = z.infer<typeof tripDetailsEntitySchema>;

const defaults = {
  client: clientEntitySchema,
};

export const emptytripDetailsEntity = generateEmptyObject<TripDetailsEntity>(
  tripDetailsEntitySchema,
  defaults
);
