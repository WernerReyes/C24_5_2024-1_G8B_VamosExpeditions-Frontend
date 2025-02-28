import { z } from "zod";
import { requestValidator } from "@/core/utils";

export type UpdateManyHotelRoomTripDetailsByDateDto = {
  readonly tripDetailsId: number;
  readonly startDate: Date;
};

const updateManyHotelRoomTripDetailsByDateDtoSchema = z.object({
  tripDetailsId: z.number(),
  startDate: z.date(),
});

export const updateManyHotelRoomTripDetailsByDateDto = {
  create: (
    dto: UpdateManyHotelRoomTripDetailsByDateDto
  ): [UpdateManyHotelRoomTripDetailsByDateDto?, string[]?] => {
    const errors = requestValidator(
      dto,
      updateManyHotelRoomTripDetailsByDateDtoSchema
    );
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
