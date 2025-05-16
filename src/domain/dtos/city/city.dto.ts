import { z } from "zod";
import { dtoValidator } from "@/core/utils";

const cityDtoSchema = z.object({
  cityId: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .default(0),
  cityName: z
    .string()
    .min(1, { message: "El campo cityName es requerido" }),
  countryId: z
    .number()
    .int()
    .positive({ message: "El campo countryId debe ser mayor que 0" }),
});

export type CityDto = z.infer<typeof cityDtoSchema>;

export const cityDto = {
  create: (dto: CityDto): [CityDto?, string[]?] => {
    const errors = dtoValidator(dto, cityDtoSchema);
    if (errors) return [undefined, errors];
    return [dto, undefined];
  },
  getSchema: cityDtoSchema,
};
