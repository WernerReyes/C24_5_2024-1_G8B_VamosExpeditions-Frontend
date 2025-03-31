import { dtoValidator } from "@/core/utils";
import { z } from "zod";



const insertManyHotelRoomTripDetailsDtoSchema = z.object({
  tripDetailsId: z.number(),
  hotelRoomId: z.number(),
  dateRange: z.array(z.date()).min(2).max(2),
  countPerDay: z.number().default(1),
  numberOfPeople: z.number(),
});

export type InsertManyHotelRoomTripDetailsDto = z.infer<
  typeof insertManyHotelRoomTripDetailsDtoSchema
>;

export const insertManyHotelRoomTripDetailsDto = {
  create: (
    dto: InsertManyHotelRoomTripDetailsDto
  ): [InsertManyHotelRoomTripDetailsDto?, string[]?] => {
    const errors = dtoValidator(
      dto,
      insertManyHotelRoomTripDetailsDtoSchema
    );
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  getSchema: insertManyHotelRoomTripDetailsDtoSchema,
};
