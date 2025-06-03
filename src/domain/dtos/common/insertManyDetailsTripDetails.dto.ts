import { dtoValidator } from "@/core/utils";
import { z } from "zod";



const insertManyDetailsTripDetailsDtoSchema = z.object({
  tripDetailsId: z.number(),
  id: z.number(),
  dateRange: z.array(z.date()).min(2).max(2),
  countPerDay: z.number().default(1),
  costPerson: z.number()
});

export type InsertManyDetailsTripDetailsDto = z.infer<
  typeof insertManyDetailsTripDetailsDtoSchema
>;

export const insertManyDetailsTripDetailsDto = {
  create: (
    dto: InsertManyDetailsTripDetailsDto
  ): [InsertManyDetailsTripDetailsDto?, string[]?] => {
    const errors = dtoValidator(
      dto,
      insertManyDetailsTripDetailsDtoSchema
    );
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  getSchema: insertManyDetailsTripDetailsDtoSchema,
};
