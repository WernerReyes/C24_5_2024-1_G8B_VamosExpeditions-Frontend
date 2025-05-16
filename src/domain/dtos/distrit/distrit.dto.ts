import { z } from "zod";
import { dtoValidator } from "@/core/utils";

const distritDtoSchema = z.object({
  distritId: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .default(0),
  distritName: z
    .string()
    .min(1, { message: "El campo distritName es requerido" }),
  cityId: z
    .number()
    .int()
    .positive({ message: "El campo cityId debe ser mayor que 0" }),
  countryId: z
    .number()
    .int()
    .positive({ message: "El campo countryId debe ser mayor que 0" }),
});

export type DistritDto = z.infer<typeof distritDtoSchema>;

export const distritDto = {
  create: (dto: DistritDto): [DistritDto?, string[]?] => {
    const errors = dtoValidator(dto, distritDtoSchema);
    if (errors) return [undefined, errors];
    return [dto, undefined];
  },
  getSchema: distritDtoSchema,
};
