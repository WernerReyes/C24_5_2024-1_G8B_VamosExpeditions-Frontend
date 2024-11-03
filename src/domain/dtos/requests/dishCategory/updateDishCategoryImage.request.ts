import { z } from "zod";
import { requestValidator } from "@/presentation/utilities";
import {
  UploadImageRequest,
  UploadImageRequestSchema,
  type UploadImageRequestModel,
} from "../common";

interface UpdateDishCategoryImageRequestModel extends UploadImageRequestModel {
  dishCategoryId: number;
}

export class UpdateDishCategoryImageRequest
  extends UploadImageRequest
  implements UpdateDishCategoryImageRequestModel
{
  constructor(
    public readonly dishCategoryId: number,
    public readonly image: File,
  ) {
    super(image);
  }

  public override validate() {
    requestValidator(this, UpdateDishCategoryImageRequest.schema);
  }

  private static get schema(): z.ZodSchema<UpdateDishCategoryImageRequestModel> {
    return UploadDishCategoryImageRequestSchema;
  }
}

const UploadDishCategoryImageRequestSchema = z.object({
  dishCategoryId: z
    .number({ message: "Dish category id must be a number" })
    .int("Dish category id must be an integer")
    .positive("Dish category id must be a positive number"),
  ...UploadImageRequestSchema.shape,
});
