import { requestValidator } from "@/core/utils";
import { z } from "zod";

export type InsertManyHotelRoomTripDetailsDto = {
  readonly tripDetailsId: number;
  readonly hotelRoomId: number;
  readonly dateRange: [Date, Date];
  readonly numberOfPeople: number;
};

const insertManyHotelRoomTripDetailsDtoSchema = z.object({
  tripDetailsId: z.number(),
  hotelRoomId: z.number(),
  dateRange: z.array(z.date()).min(2).max(2),
  numberOfPeople: z.number(),
});

export const insertManyHotelRoomTripDetailsDto = {
  create: (
    dto: InsertManyHotelRoomTripDetailsDto
  ): [InsertManyHotelRoomTripDetailsDto?, string[]?] => {
    const errors = requestValidator(
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
