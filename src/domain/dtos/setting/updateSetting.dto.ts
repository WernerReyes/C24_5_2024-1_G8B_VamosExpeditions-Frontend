import { dtoValidator } from "@/core/utils";
import { z } from "zod";

const updateSettingDtoSchema = z.object({
  id: z.number(),
  value: z.string().nullable(),
});

export type UpdateSettingDto = z.infer<typeof updateSettingDtoSchema>;

export const updateSettingDto = {
  create: (dto: UpdateSettingDto): [UpdateSettingDto?, string[]?] => {
    const errors = dtoValidator(dto, updateSettingDtoSchema);
    if (errors) return [undefined, errors];

    return [dto, undefined];
  },

  getSchema: updateSettingDtoSchema,
};
