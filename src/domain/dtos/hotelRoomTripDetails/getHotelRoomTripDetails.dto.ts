import { z } from "zod";
import { dtoValidator } from "@/core/utils";

const getHotelRoomTripDetailsDtoSchema = z.object({
  tripDetailsId: z.number().positive().min(1),
});

export type GetHotelRoomTripDetailsDto = z.infer<
  typeof getHotelRoomTripDetailsDtoSchema>

export const getHotelRoomTripDetailsDto = {
  create: (
    dto: GetHotelRoomTripDetailsDto
  ): [GetHotelRoomTripDetailsDto?, string[]?] => {
    const errors = dtoValidator(dto, getHotelRoomTripDetailsDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
