import { dtoValidator } from "@/core/utils";

import { z } from "zod";


const paginationDtoSchema = z.object({
  page: z.number().positive().min(1).optional(),
  limit: z.number().positive().min(1).optional(),
});


export type PaginationDto = z.infer<typeof paginationDtoSchema>;


export const paginationDto = {
  create: (dto: PaginationDto): [PaginationDto?, string[]?] => {
    const errors = dtoValidator(dto, paginationDtoSchema);
    if (errors) return [undefined, errors];

    return [dto, undefined];
  },

  getSchema: paginationDtoSchema,
};