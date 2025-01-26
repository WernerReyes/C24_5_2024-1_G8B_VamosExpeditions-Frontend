import { requestValidator } from "@/core/utils";

import { z } from "zod";

export type GetHotelsDto = {
  readonly cityId?: number;
  readonly countryId?: number;
};

const getHotelsDtoSchema = z.object({
  cityId: z.number().positive().min(1).optional(),
  countryId: z.number().positive().min(1).optional(),
});

export const getHotelsDto = {
  create: (dto: GetHotelsDto): [GetHotelsDto?, string[]?] => {
    const errors = requestValidator(dto, getHotelsDtoSchema);
    if (errors) return [undefined, errors];

    return [dto, undefined];
  },

  getSchema: getHotelsDtoSchema,
};
