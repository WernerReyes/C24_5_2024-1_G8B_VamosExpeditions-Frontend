import type { PartnerEntity } from "./partner.entity";
import type { ReservationEntity } from "./reservation.entity";
import type { TripDetailsEntity } from "./tripDetails.entity";
import type { UserEntity } from "./user.entity";

export enum VersionQuotationStatus {
  DRAFT = "DRAFT",
  COMPLETED = "COMPLETED",
  CANCELATED = "CANCELATED",
  APPROVED = "APPROVED",
}

type VersionQuotationRender = {
  label: string;
  icon: string;
  severity: "info" | "warning" | "success" | "danger" | "secondary";
};

export const versionQuotationRender: Record<
  VersionQuotationStatus,
  VersionQuotationRender
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

export enum AllowVersionQuotationType {
  TRANSPORTATION = "TRANSPORTATION",
  ACTIVITY = "ACTIVITY",
  ACCOMMODATION = "ACCOMMODATION",
  FOOD = "FOOD",
  GUIDE = "GUIDE",
}

export const allowVersionQuotationTypesRender: Record<
  AllowVersionQuotationType,
  VersionQuotationRender & {
    value: AllowVersionQuotationType;
  }
> = {
  [AllowVersionQuotationType.TRANSPORTATION]: {
    label: "Transporte",
    severity: "info",
    icon: "pi pi-car",
    value: AllowVersionQuotationType.TRANSPORTATION,
  },
  [AllowVersionQuotationType.ACTIVITY]: {
    label: "Actividad",
    severity: "info",
    icon: "pi pi-calendar",
    value: AllowVersionQuotationType.ACTIVITY,
  },
  [AllowVersionQuotationType.ACCOMMODATION]: {
    label: "Alojamiento",
    severity: "info",
    icon: "pi pi-home",
    value: AllowVersionQuotationType.ACCOMMODATION,
  },
  [AllowVersionQuotationType.FOOD]: {
    label: "Comida",
    severity: "info",
    icon: "pi pi-apple",
    value: AllowVersionQuotationType.FOOD,
  },
  [AllowVersionQuotationType.GUIDE]: {
    label: "Guía",
    severity: "info",
    icon: "pi pi-user",
    value: AllowVersionQuotationType.GUIDE,
  },
};
export interface VersionQuotationEntity {
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
  commission?: number;
  partner?: PartnerEntity;
  reservation?: ReservationEntity;
  tripDetails?: TripDetailsEntity;
  user?: UserEntity;
}
