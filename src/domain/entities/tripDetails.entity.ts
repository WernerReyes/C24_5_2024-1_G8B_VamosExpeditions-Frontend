import type { CityEntity, } from "./city.entity";
import type { ClientEntity, } from "./client.entity";
import { HotelRoomTripDetailsEntity } from "./hotelRoomTripDetails.entity";
import { ServiceTripDetailsEntity } from "./serviceTripDetails.entity";
import {
  VersionQuotationEntity
} from "./versionQuotation.entity";

export enum TravelerStyle {
  STANDARD = "STANDARD",
  COMFORT = "COMFORT",
  LUXUS = "LUXUS",
}


export enum OrderType {
  DIRECT = "DIRECT",
  INDIRECT = "INDIRECT",
}


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
  serviceTripDetails?: ServiceTripDetailsEntity[];
  client?: ClientEntity;
  cities?: CityEntity[];
};
