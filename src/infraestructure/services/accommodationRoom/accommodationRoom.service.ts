import { httpRequest } from "@/config";
import { AccommodationRoomEntity,  } from "@/domain/entities";

const PREFIX = "/accommodation-room";

export const accommodationRoomService = {
  getAll: async () => {
    try {
      return await httpRequest.get<AccommodationRoomEntity[]>(PREFIX);
    } catch (error) {
      throw error;
    }
  },

/*   countryAndCity: async (data: CityEntity | null) => {
     try {
      return await httpRequest.get(`/nation/search/${data?.country.name}/${data?.name}`);
     } catch (error) {
        throw error;
     }

  },  */


};
