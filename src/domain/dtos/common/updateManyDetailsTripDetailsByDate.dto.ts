import { z } from "zod";
import { dtoValidator } from "@/core/utils";

const updateManyDetailsTripDetailsByDateDtoSchema = z.object({
  tripDetailsId: z.number(),
  startDate: z.date(),
});

export type UpdateManyDetailsTripDetailsByDateDto = z.infer<
  typeof updateManyDetailsTripDetailsByDateDtoSchema
>;

export const updateManyDetailsTripDetailsByDateDto = {
  create: (
    dto: UpdateManyDetailsTripDetailsByDateDto
  ): [UpdateManyDetailsTripDetailsByDateDto?, string[]?] => {
    const errors = dtoValidator(
      dto,
      updateManyDetailsTripDetailsByDateDtoSchema
    );
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
