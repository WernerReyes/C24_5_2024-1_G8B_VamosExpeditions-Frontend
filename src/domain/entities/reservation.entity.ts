import { z } from "zod";
import { clientEntitySchema } from "./client.entity";
import { generateEmptyObject } from "@/core/utils";
import type { Severity } from "@/presentation/types";
import { tripDetailsEntitySchema } from "./tripDetails.entity";

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

export const reservationEntitySchema = z.object({
  id: z.number().int().positive().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.nativeEnum(ReservationStatus),
  tripDetails: z.object(tripDetailsEntitySchema.shape).optional(),
});

export type ReservationEntity = z.infer<typeof reservationEntitySchema>;

const defaults = {
  client: clientEntitySchema,
};

export const emptyReservationEntity = generateEmptyObject<ReservationEntity>(
  reservationEntitySchema,
  defaults
);
