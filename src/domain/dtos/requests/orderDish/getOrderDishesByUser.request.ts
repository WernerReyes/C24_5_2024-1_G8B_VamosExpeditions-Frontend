import { z } from "zod";
import { OrderDishStatusEnum } from "@/domain/entities";
import { requestValidator } from "@/presentation/utilities";
import { PaginationRequest, type PaginationRequestModel, PaginationRequestSchema } from "../common";

interface GetOrderDishesByUserRequestModel extends PaginationRequestModel {
  readonly status: { status: OrderDishStatusEnum }[];
}

export class GetOrderDishesByUserRequest
  extends PaginationRequest
  implements GetOrderDishesByUserRequestModel
{
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly status: { status: OrderDishStatusEnum }[],
  ) {
    super(page, limit);
  }

  public validate() {
    requestValidator(this, GetOrderDishesByUserRequest.schema);
  }

  protected static override get schema(): z.ZodSchema<GetOrderDishesByUserRequestModel> {
    return GetOrderDishesByUserRequestSchema;
  }
}

export const GetOrderDishesByUserRequestSchema = z.object({
  status: z.array(
    z.object({
      status: z
        .nativeEnum(OrderDishStatusEnum)
        .refine((n) => Object.values(OrderDishStatusEnum).includes(n), {
          message: `status must be one of the following values: ${Object.values(OrderDishStatusEnum).join(", ")}`,
        }),
    }),
  ),
  ...PaginationRequestSchema.shape,
});
