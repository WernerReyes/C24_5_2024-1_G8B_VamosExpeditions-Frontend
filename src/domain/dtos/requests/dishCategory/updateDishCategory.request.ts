import { requestValidator } from "@/presentation/utilities";
import { z } from "zod";
import {
  DishCategoryRequest,
  type DishCategoryRequestModel,
  DishCategoryRequestSchema,
} from "./dishCategory.request";

interface UpdateDishCategoryRequestModel extends DishCategoryRequestModel {
  readonly id: number;
}

export class UpdateDishCategoryRequest
  extends DishCategoryRequest
  implements UpdateDishCategoryRequestModel
{
  constructor(
    public readonly id: number,
    public readonly name: string,
  ) {
    super(name);
  }

  public override validate() {
    requestValidator(this, UpdateDishCategoryRequest.schema);
  }

  public static override get schema(): z.ZodSchema<UpdateDishCategoryRequestModel> {
    return UpdateDishCategoryRequestSchema;
  }
}

export const UpdateDishCategoryRequestSchema = z.object({
  id: z
    .number({
      message: "id must be a number",
    })
    .int("id must be an integer")
    .positive("id must be a positive number"),
  ...DishCategoryRequestSchema.shape,
});
