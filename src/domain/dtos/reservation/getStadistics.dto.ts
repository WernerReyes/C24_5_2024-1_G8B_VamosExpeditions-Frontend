import { dtoValidator } from "@/core/utils";
import { z } from "zod";

const getStadisticsDtoSchema = z.object({
  year: z
    .optional(z.number()
    .int()
    .min(2000)
    .max(3000)).default(new Date().getFullYear()),
    
});

export type GetStadisticsDto = z.infer<typeof getStadisticsDtoSchema>;

export const getStadisticsDto = {
  create: (dto: GetStadisticsDto): [GetStadisticsDto?, string[]?] => {
    const errors = dtoValidator(dto, getStadisticsDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
