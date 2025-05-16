import { z } from "zod";
import { dtoValidator } from "@/core/utils";

const countryDtoSchema = z.object({
  countryId: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .default(0),
  countryName: z
    .string()
    .min(1, { message: "El campo countryName es requerido" }),
  countryCode: z
    .string()
    .min(1, { message: "El campo countryCode es requerido" }),
});

export type CountryDto = z.infer<typeof countryDtoSchema>;

export const countryDto = {
  create: (dto: CountryDto): [CountryDto?, string[]?] => {
    const errors = dtoValidator(dto, countryDtoSchema);
    if (errors) return [undefined, errors];
    return [dto, undefined];
  },
  getSchema: countryDtoSchema,
};
