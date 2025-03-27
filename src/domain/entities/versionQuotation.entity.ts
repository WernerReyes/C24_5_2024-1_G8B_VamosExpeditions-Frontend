
import type { ReservationEntity } from "./reservation.entity";
import type { TripDetailsEntity } from "./tripDetails.entity";
import type { UserEntity } from "./user.entity";

export enum VersionQuotationStatus {
  DRAFT = "DRAFT",
  COMPLETED = "COMPLETED",
  CANCELATED = "CANCELATED",
  APPROVED = "APPROVED",
}

type VersionQuotationStatusRender = {
  label: string;
  icon: string;
  severity: "info" | "warning" | "success" | "danger" | "secondary";
};

export const versionQuotationRender: Record<
  VersionQuotationStatus,
  VersionQuotationStatusRender
> = {
  [VersionQuotationStatus.DRAFT]: {
    label: "Borrador",
    severity: "secondary",
    icon: "pi pi-pencil",
  },
  [VersionQuotationStatus.COMPLETED]: {
    label: "Completado",
    severity: "info",
    icon: "pi pi-check",
  },
  [VersionQuotationStatus.CANCELATED]: {
    label: "Cancelado",
    severity: "danger",
    icon: "pi pi-times",
  },
  [VersionQuotationStatus.APPROVED]: {
    label: "Aprobado",
    severity: "success",
    icon: "pi pi-check",
  },
};

export interface VersionQuotationEntity  {
  id: { quotationId: number; versionNumber: number };
  name: string;
  status: VersionQuotationStatus;
  createdAt: Date;
  updatedAt: Date;
  official: boolean;
  completionPercentage: number;
  indirectCostMargin?: number;
  profitMargin?: number;
  finalPrice?: number;
  reservation?: ReservationEntity;
  tripDetails?: TripDetailsEntity;
  user?: UserEntity;

}