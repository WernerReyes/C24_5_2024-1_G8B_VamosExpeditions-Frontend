import { z } from "zod";

export type PaginationRequestModel = {
  readonly page?: number;
  readonly limit?: number;
};

export class PaginationRequest implements PaginationRequestModel {
  protected constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}

  protected static get schema(): z.ZodSchema<PaginationRequestModel> {
    return PaginationRequestSchema;
  }
}

export const PaginationRequestSchema = z.object({
  page: z
    .number()
    .int("Invalid page, it must be an integer number")
    .positive("Invalid page, it must be a positive number")
    .optional()
    .default(1),

  limit: z
    .number()
    .int("Invalid limit, it must be an integer number")
    .positive("Invalid limit, it must be a positive number")
    .optional()
    .default(10),
});
