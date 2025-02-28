import { requestValidator } from "@/core/utils";
import { z } from "zod";

export type HotelRoomTripDetailsDto = {
  readonly tripDetailsId: number;
  readonly hotelRoomId: number;
  readonly day: number;
  readonly numberOfPeople: number;
};

const hotelRoomTripDetailsDtoSchema = z.object({
  tripDetailsId: z.number(),
  hotelRoomId: z.number(),
  day: z.number(),
  numberOfPeople: z.number(),
});

export const hotelRoomTripDetailsDto = {
  create: (
    dto: HotelRoomTripDetailsDto
  ): [HotelRoomTripDetailsDto?, string[]?] => {
    const errors = requestValidator(dto, hotelRoomTripDetailsDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  getSchema: hotelRoomTripDetailsDtoSchema,
};
