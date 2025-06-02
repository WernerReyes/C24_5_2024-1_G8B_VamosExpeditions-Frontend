import { dtoValidator } from "@/core/utils";
import { z } from "zod";

const insertManyServiceTripDetailsDtoSchema = z.object({
  tripDetailsId: z.number(),
  serviceId: z.number(),
  dateRange: z.array(z.date()).min(2).max(2),
  countPerDay: z.number().default(1),
  costPerson: z.number(),
});

export type InsertManyServiceTripDetailsDto = z.infer<
  typeof insertManyServiceTripDetailsDtoSchema
>;

export const insertManyServiceTripDetailsDto = {
  create: (
    dto: InsertManyServiceTripDetailsDto
  ): [InsertManyServiceTripDetailsDto?, string[]?] => {
    const errors = dtoValidator(dto, insertManyServiceTripDetailsDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  getSchema: insertManyServiceTripDetailsDtoSchema,
};
