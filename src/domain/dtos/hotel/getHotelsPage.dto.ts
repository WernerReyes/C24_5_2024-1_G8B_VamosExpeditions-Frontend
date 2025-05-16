import { dtoValidator } from "@/core/utils";
import { z } from "zod";
import { paginationDtoSchema } from "../common";

const getHotelsPageDtoSchema = z
  .object({
    name: z.string().nullable().optional(),
    distrit: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
  })
  .merge(paginationDtoSchema);

export type GetHotelsPageDto = z.infer<typeof getHotelsPageDtoSchema>;

export const getHotelsPageDto = {
  create: (dto: GetHotelsPageDto): [GetHotelsPageDto?, string[]?] => {
    const errors = dtoValidator(dto, getHotelsPageDtoSchema);
    if (errors) return [undefined, errors];

    return [dto, undefined];
  },
};
