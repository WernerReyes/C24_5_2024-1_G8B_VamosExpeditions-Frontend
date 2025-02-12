import { z } from "zod";
import { requestValidator } from "@/core/utils";

export type UpdateManyHotelRoomQuotationsByDateDto = {
  readonly versionQuotationId: {
    readonly quotationId: number;
    readonly versionNumber: number;
  };
  readonly startDate: Date;
};

const updateManyHotelRoomQuotationsByDateDtoSchema = z.object({
  versionQuotationId: z.object({
    quotationId: z.number().int().min(1),
    versionNumber: z.number().int().min(1),
  }),
  startDate: z.date(),
});

export const updateManyHotelRoomQuotationsByDateDto = {
  create: (
    dto: UpdateManyHotelRoomQuotationsByDateDto
  ): [UpdateManyHotelRoomQuotationsByDateDto?, string[]?] => {
    const errors = requestValidator(
      dto,
      updateManyHotelRoomQuotationsByDateDtoSchema
    );
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
