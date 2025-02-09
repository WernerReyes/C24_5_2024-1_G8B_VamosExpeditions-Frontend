import { requestValidator } from "@/core/utils";
import { z } from "zod";

export type InsertManyhotelRoomQuotationsDto = {
  readonly hotelRoomId: number;
  readonly versionQuotationId: {
    readonly quotationId: number;
    readonly versionNumber: number;
  };
  readonly dateRange: [Date, Date];
  readonly numberOfPeople: number;
};

const insertManyhotelRoomQuotationsDtoSchema = z.object({
  hotelRoomId: z.number(),
  versionQuotationId: z.object({
    quotationId: z.number(),
    versionNumber: z.number(),
  }),
  dateRange: z.array(z.date()).min(2).max(2),
  numberOfPeople: z.number(),
});

export const insertManyhotelRoomQuotationsDto = {
  create: (
    dto: InsertManyhotelRoomQuotationsDto
  ): [InsertManyhotelRoomQuotationsDto?, string[]?] => {
    const errors = requestValidator(
      dto,
      insertManyhotelRoomQuotationsDtoSchema
    );
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  getSchema: insertManyhotelRoomQuotationsDtoSchema,
};
