import { z } from "zod";
import { clientEntitySchema } from "./client.entity";
import { cityEntitySchema } from "./city.entity";
import { generateEmptyObject } from "@/core/utils";
import type { Severity } from "@/presentation/types";

export enum ReservationStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
}

export const reservationStatusRender: Record<
  ReservationStatus,
  { label: string; severity: Severity; icon: string }
> = {
  ACTIVE: {
    label: "Activa",
    severity: "info",
    icon: "pi pi-check",
  },
  CANCELED: {
    label: "Cancelada",
    severity: "danger",
    icon: "pi pi-times",
  },
  COMPLETED: {
    label: "Completada",
    severity: "success",
    icon: "pi pi-check",
  },
  PENDING: {
    label: "Pendiente",
    severity: "warning",
    icon: "pi pi-clock",
  },
};

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

export const reservationEntitySchema = z.object({
  id: z.number().int().positive().min(1),
  numberOfPeople: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  code: z.string(),
  travelerStyle: z.nativeEnum(TravelerStyle),
  orderType: z.nativeEnum(OrderType),
  status: z.nativeEnum(ReservationStatus),
  specialSpecifications: z.string().optional(),
  client: z.object(clientEntitySchema.shape).optional(),
  cities: z.array(cityEntitySchema).optional(),
});

export type ReservationEntity = z.infer<typeof reservationEntitySchema>;

const defaults = {
  client: clientEntitySchema,
};

export const emptyReservationEntity = generateEmptyObject<ReservationEntity>(
  reservationEntitySchema,
  defaults
);
