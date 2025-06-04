import { dtoValidator } from "@/core/utils";
import { z } from "zod";

export const paginationDtoSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(5).optional(),
});

export type PaginationDto = z.infer<typeof paginationDtoSchema>;

export const paginationDto = {
    create: (dto: PaginationDto): [PaginationDto?, string[]?] => {
      const errors = dtoValidator(dto, paginationDtoSchema);
      return errors ? [undefined, errors] : [dto, undefined];
    },
};
