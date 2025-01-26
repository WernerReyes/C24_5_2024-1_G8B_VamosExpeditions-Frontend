import { requestValidator } from "@/core/utils";
import { z } from "zod";

export type HotelRoomQuotationDto = {
  readonly hotelRoomId: number;
  readonly versionQuotationId: {
    readonly quotationId: number;
    readonly versionNumber: number;
  };
  readonly day: number;
  readonly numberOfPeople: number;
};

const hotelRoomQuotationDtoSchema = z.object({
  hotelRoomId: z.number(),
  versionQuotationId: z.object({
    quotationId: z.number(),
    versionNumber: z.number(),
  }),
  day: z.number(),
  numberOfPeople: z.number(),
});


export const hotelRoomQuotationDto = {
  create: (dto: HotelRoomQuotationDto): [HotelRoomQuotationDto?, string[]?] => {
    const errors = requestValidator(dto, hotelRoomQuotationDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  getSchema: hotelRoomQuotationDtoSchema,
};

