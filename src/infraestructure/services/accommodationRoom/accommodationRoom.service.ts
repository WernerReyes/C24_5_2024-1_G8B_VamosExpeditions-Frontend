import { httpRequest } from "@/config";
import { AccommodationRoomEntity } from "@/domain/entities";

const PREFIX = "/accommodation-room";

export const accommodationRoomService = {
  getAll: async () => {
    try {
      return await httpRequest.get<AccommodationRoomEntity[]>(PREFIX);
    } catch (error) {
      throw error;
    }
  },
};
