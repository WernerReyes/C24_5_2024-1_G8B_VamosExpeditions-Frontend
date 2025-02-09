import { z } from "zod";
import { requestValidator } from "@/core/utils";

export type DeleteManyHotelRoomQuotationsByDateDto = {
  readonly quotationId: number;
  readonly versionNumber: number;
  readonly date: Date;
};

const deleteManyHotelRoomQuotationsByDateDtoSchema = z.object({
  quotationId: z.number().min(1),
  versionNumber: z.number().min(1),
  date: z.date(),
});

export const deleteManyHotelRoomQuotationsByDateDto = {
  create: (
    dto: DeleteManyHotelRoomQuotationsByDateDto
  ): [DeleteManyHotelRoomQuotationsByDateDto?, string[]?] => {
    const errors = requestValidator(
      dto,
      deleteManyHotelRoomQuotationsByDateDtoSchema
    );
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
