import { z } from "zod";
import { requestValidator } from "@/presentation/utilities";
import {
  UploadImageRequest,
  UploadImageRequestSchema,
  type UploadImageRequestModel,
} from "../common";

interface UpdateDishImageRequestModel extends UploadImageRequestModel {
  readonly dishId: number;
  readonly imageIdToUpdate: number | null;
}

export class UpdateDishImageRequest
  extends UploadImageRequest
  implements UpdateDishImageRequestModel
{
  constructor(
    public readonly dishId: number,
    public readonly file: File,
    public readonly imageIdToUpdate: number | null,
  ) {
    super(file);
  }

  public override validate() {
    requestValidator(this, UpdateDishImageRequest.schema);
  }

  public override get toFormData(): FormData {
    const formData = super.toFormData;
    formData.append(
      "updateDishImageRequest",
      new Blob(
        [
          JSON.stringify({
            dishId: this.dishId,
            imageIdToUpdate: this.imageIdToUpdate,
          }),
        ],
        { type: "application/json" },
      ),
    );

    return formData;
  }

  protected static get schema(): z.ZodSchema<UpdateDishImageRequestModel> {
    return UpdateDishImageRequestSchema;
  }
}

export const UpdateDishImageRequestSchema = z.object({
  dishId: z.number({
    message: "dishId must be a number greater than or equal to 0",
  }),
  imageIdToUpdate: z
    .number({
      message: "imageIdToUpdate must be a number greater than or equal to 0",
    })
    .nullable(),
  ...UploadImageRequestSchema.shape,
});
