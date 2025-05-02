import type { Severity } from "@/presentation/types";
import type { VersionQuotationEntity } from "./versionQuotation.entity";

export enum ReservationStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  REJECTED = "REJECTED",
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
  REJECTED: {
    label: "Rechazada",
    severity: "danger",
    icon: "pi pi-times",
  },
  PENDING: {
    label: "Pendiente",
    severity: "warning",
    icon: "pi pi-clock",
  },
};


export interface ReservationEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  status: ReservationStatus;
  versionQuotation: VersionQuotationEntity;

  isDeleted: boolean;
  deletedAt?: Date;
  deleteReason?: string;
}


