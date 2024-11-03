import { requestValidator } from "@/presentation/utilities";
import { z } from "zod";

export type DishCategoryRequestModel = {
  readonly name: string;
};

export class DishCategoryRequest implements DishCategoryRequestModel {
  constructor(public readonly name: string) {}

  public validate() {
    requestValidator(this, DishCategoryRequest.schema);
  }

  public static get schema(): z.ZodSchema<DishCategoryRequestModel> {
    return DishCategoryRequestSchema;
  }
}

export const DishCategoryRequestSchema = z.object({
  name: z
    .string({
      message: "Name is required",
    })
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
});
