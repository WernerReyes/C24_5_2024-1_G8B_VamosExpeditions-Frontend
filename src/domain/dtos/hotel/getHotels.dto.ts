import { requestValidator } from "@/core/utils";
import { z } from "zod";


export type GetHotelsDto = {
  readonly cityId?: number;
  readonly countryId?: number;
};

export const getHotelsDto = (
  cityId?: number,
  countryId?: number
) => {
  return {
    create: (): [GetHotelsDto?, string[]?] => {
      const errors = requestValidator(
        {
          cityId,
          countryId,
        },
        getHotelsDtoSchema
      );
      if (errors) return [undefined, errors];

      return [
        {
          cityId,
          countryId,
        },
        undefined,
      ];
    },
  };
}

export const getHotelsDtoSchema = z.object({
  cityId: z.number().positive().min(1).optional(),
  countryId: z.number().positive().min(1).optional(),
});