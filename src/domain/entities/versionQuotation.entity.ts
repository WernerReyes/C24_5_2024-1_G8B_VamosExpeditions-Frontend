import type { RenderStatus } from "@/presentation/types";
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

export const versionQuotationRender: Record<
  VersionQuotationStatus,
  RenderStatus<VersionQuotationStatus>
> = {
  [VersionQuotationStatus.DRAFT]: {
    label: "Borrador",
    severity: "secondary",
    icon: "pi pi-pencil",
    value: VersionQuotationStatus.DRAFT,
  },
  [VersionQuotationStatus.COMPLETED]: {
    label: "Completado",
    severity: "info",
    icon: "pi pi-check",
    value: VersionQuotationStatus.COMPLETED,
  },
  [VersionQuotationStatus.CANCELATED]: {
    label: "Cancelado",
    severity: "danger",
    icon: "pi pi-times",
    value: VersionQuotationStatus.CANCELATED,
  },
  [VersionQuotationStatus.APPROVED]: {
    label: "Aprobado",
    severity: "success",
    icon: "pi pi-check",
    value: VersionQuotationStatus.APPROVED,
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
  RenderStatus<AllowVersionQuotationType>
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
  indirectCostMargin?: number | null;
  profitMargin?: number | null;
  finalPrice?: number | null;
  commission: number | null;
  partner: PartnerEntity | null;
  reservation?: ReservationEntity;
  tripDetails?: TripDetailsEntity;
  user?: UserEntity;

  hasVersions: boolean;

  isDeleted: boolean;
  deletedAt?: Date;
  deleteReason?: string;
}
