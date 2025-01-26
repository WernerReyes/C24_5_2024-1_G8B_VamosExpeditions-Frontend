import { z } from "zod";
import { requestValidator } from "@/core/utils";

export type GetHotelRoomQuotationsDto = {
  readonly quotationId?: number;
  readonly versionNumber?: number;
};

const getHotelRoomQuotationsDtoSchema = z.object({
  quotationId: z.number().optional(),
  versionNumber: z.number().optional(),
});

export const getHotelRoomQuotationsDto = {
  create: (
    dto: GetHotelRoomQuotationsDto
  ): [GetHotelRoomQuotationsDto?, string[]?] => {
    const errors = requestValidator(dto, getHotelRoomQuotationsDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
