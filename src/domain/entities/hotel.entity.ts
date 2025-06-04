import type { DistritEntity } from "./distrit.entity";
import type { HotelRoomEntity } from "./hotelRoom.entity";

export enum HotelCategory {
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  BOUTIQUE = "BOUTIQUE",
  VILLA = "VILLA",
  LODGE = "LODGE",
}
export interface HotelEntity {
  id: number;
  name: string;
  category: HotelCategory;
  address: string;
  email: string;
  hotelRooms?: HotelRoomEntity[];
  distrit?: DistritEntity;
  readonly isDeleted?: boolean;
  readonly deletedAt?: Date;
  readonly deleteReason?: string;
}
