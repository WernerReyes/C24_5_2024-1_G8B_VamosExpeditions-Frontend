import { z } from "zod";
import { requestValidator } from "@/presentation/utilities";

type GetDishesWithoutSelectedDishRequestModel = {
  readonly idDish: number;
  readonly limit?: number | null;
};

export class GetDishesWithoutSelectedDishRequest
  implements GetDishesWithoutSelectedDishRequestModel
{
  constructor(
    public readonly idDish: number,
    public readonly limit?: number | null,
  ) {}

  public validate() {
    requestValidator(this, GetDishesWithoutSelectedDishRequest.schema);
  }

  private static get schema(): z.ZodSchema<GetDishesWithoutSelectedDishRequestModel> {
    return GetDishesWithoutSelectedDishRequestSchema;
  }
}

const GetDishesWithoutSelectedDishRequestSchema = z.object({
  idDish: z.number({
    message: "dishId is required",
  }),
  limit: z.number().optional().default(4),
});
