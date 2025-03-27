import type { HotelRoomEntity } from "./hotelRoom.entity";
import type { TripDetailsEntity } from "./tripDetails.entity";
export interface HotelRoomTripDetailsEntity {
  id: number;
  numberOfPeople: number;
  date: Date;
  hotelRoom?: HotelRoomEntity;
  tripDetails?: TripDetailsEntity;
}