import { dtoValidator } from "@/core/utils";
import { z } from "zod";

const hotelRoomTripDetailsDtoSchema = z.object({
  tripDetailsId: z.number(),
  hotelRoomId: z.number(),
  day: z.number(),
  numberOfPeople: z.number(),
});

export type HotelRoomTripDetailsDto = z.infer<
  typeof hotelRoomTripDetailsDtoSchema>

export const hotelRoomTripDetailsDto = {
  create: (
    dto: HotelRoomTripDetailsDto
  ): [HotelRoomTripDetailsDto?, string[]?] => {
    const errors = dtoValidator(dto, hotelRoomTripDetailsDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  getSchema: hotelRoomTripDetailsDtoSchema,
};
