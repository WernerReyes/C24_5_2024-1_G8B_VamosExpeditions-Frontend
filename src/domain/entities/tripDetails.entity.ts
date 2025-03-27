import type { Severity } from "@/presentation/types";
import type { CityEntity, } from "./city.entity";
import type { ClientEntity, } from "./client.entity";
import {
  VersionQuotationEntity
} from "./versionQuotation.entity";
import { HotelRoomTripDetailsEntity } from "./hotelRoomTripDetails.entity";

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

export type TripDetailsEntity = {
  id: number;
  numberOfPeople: number;
  startDate: Date;
  endDate: Date;
  code: string;
  travelerStyle: TravelerStyle;
  orderType: OrderType;
  specialSpecifications?: string;
  versionQuotation?: VersionQuotationEntity;
  hotelRoomTripDetails?: HotelRoomTripDetailsEntity[];
  client?: ClientEntity;
  cities?: CityEntity[];
};
