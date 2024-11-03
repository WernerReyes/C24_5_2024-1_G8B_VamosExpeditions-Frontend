import { z } from "zod";
import { OrderDishStatusEnum } from "@/domain/entities";
import { requestValidator } from "@/presentation/utilities";

type UpdateOrderDishStatusRequestModel = {
  readonly orderDishId: number;
  readonly status: OrderDishStatusEnum;
};

export class UpdateOrderDishStatusRequest implements UpdateOrderDishStatusRequestModel {
  constructor(
    public readonly orderDishId: number,
    public readonly status: OrderDishStatusEnum,
  ) {}

  public validate() {
    requestValidator(this, UpdateOrderDishStatusRequest.schema);
  }

  private static get schema(): z.ZodSchema<UpdateOrderDishStatusRequestModel> {
    return UpdateOrderDishStatusRequestSchema;
  }
}

const UpdateOrderDishStatusRequestSchema = z.object({
  orderDishId: z
    .number({
      message: "orderDishId must be a number",
    })
    .positive("orderDishId must be a positive number")
    .int("orderDishId must be an integer")
    .refine((n) => n > 0, {
      message: "orderDishId must be greater than 0",
    }),
  status: z
    .nativeEnum(OrderDishStatusEnum)
    .refine(
      (s) =>
        Object.values(OrderDishStatusEnum).includes(s as OrderDishStatusEnum),
      {
        message:
          "status must be one of the following values: pending, accepted, rejected",
      },
    ),
});
