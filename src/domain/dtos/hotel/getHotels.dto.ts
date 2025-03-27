import { dtoValidator } from "@/core/utils";

import { z } from "zod";


const getHotelsDtoSchema = z.object({
  cityId: z.number().positive().min(1).optional(),
  countryId: z.number().positive().min(1).optional(),
});

export type GetHotelsDto = z.infer<typeof getHotelsDtoSchema>;

export const getHotelsDto = {
  create: (dto: GetHotelsDto): [GetHotelsDto?, string[]?] => {
    const errors = dtoValidator(dto, getHotelsDtoSchema);
    if (errors) return [undefined, errors];

    return [dto, undefined];
  },

  getSchema: getHotelsDtoSchema,
};
