import type { HotelEntity } from "./hotel.entity";
export interface HotelRoomEntity {
  id: number;
  roomType: string;
  capacity: number;
  seasonType?: string;
  serviceTax?: number;
  rateUsd?: number;
  priceUsd?: number;
  pricePen?: number;
  readonly isDeleted?: boolean;
  readonly deletedAt?: Date;
  readonly deleteReason?: string;
  hotel?: HotelEntity;
}
