import { z } from "zod";
import { requestValidator } from "@/core/utils";

export type GetHotelRoomTripDetailsDto = {
  readonly tripDetailsId: number;
};

const getHotelRoomTripDetailsDtoSchema = z.object({
  tripDetailsId: z.number().positive().min(1),
});

export const getHotelRoomTripDetailsDto = {
  create: (
    dto: GetHotelRoomTripDetailsDto
  ): [GetHotelRoomTripDetailsDto?, string[]?] => {
    const errors = requestValidator(dto, getHotelRoomTripDetailsDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
