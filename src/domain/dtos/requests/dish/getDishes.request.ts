import { z } from "zod";
import { requestValidator } from "@/presentation/utilities";
import {
  PaginationRequest,
  type PaginationRequestModel,
  PaginationRequestSchema,
} from "../common";

interface GetDishesRequestModel extends PaginationRequestModel {
  readonly idCategory: { idCategory: number }[] | null;
  readonly priceRange: { min: number; max: number } | null;
  readonly search: string | null;
}

export class GetDishesRequest
  extends PaginationRequest
  implements GetDishesRequestModel
{
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly idCategory: { idCategory: number }[] | null,
    public readonly priceRange: { min: number; max: number } | null,
    public readonly search: string | null,
  ) {
    super(page, limit);
  }

  public validate() {
    requestValidator(this, GetDishesRequest.schema);
  }

  protected static override get schema(): z.ZodSchema<GetDishesRequestModel> {
    return GetDishesRequestSchema;
  }
}

const GetDishesRequestSchema = z.object({
  idCategory: z
    .array(
      z.object({
        idCategory: z.number().refine((n) => n >= 0, {
          message: "idCategory must be a number greater than or equal to 0",
        }),
      }),
    )
    .nullable(),
  priceRange: z
    .object({
      min: z.number().refine((n) => n >= 0, {
        message: "min must be a number greater than or equal to 0",
      }),
      max: z.number().refine((n) => n >= 0, {
        message: "max must be a number greater than or equal to 0",
      }),
    })
    .nullable(),
  search: z.nullable(z.string()),
  ...PaginationRequestSchema.shape,
});
