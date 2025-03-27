import { z } from "zod";
import { dtoValidator } from "@/core/utils";

const updateManyHotelRoomTripDetailsByDateDtoSchema = z.object({
  tripDetailsId: z.number(),
  startDate: z.date(),
});

export type UpdateManyHotelRoomTripDetailsByDateDto = z.infer<
  typeof updateManyHotelRoomTripDetailsByDateDtoSchema
>;

export const updateManyHotelRoomTripDetailsByDateDto = {
  create: (
    dto: UpdateManyHotelRoomTripDetailsByDateDto
  ): [UpdateManyHotelRoomTripDetailsByDateDto?, string[]?] => {
    const errors = dtoValidator(
      dto,
      updateManyHotelRoomTripDetailsByDateDtoSchema
    );
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
