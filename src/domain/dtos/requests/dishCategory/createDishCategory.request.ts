import {
  DishCategoryRequest,
  type DishCategoryRequestModel,
} from "./dishCategory.request";

interface CreateDishCategoryRequestModel extends DishCategoryRequestModel {}

export class CreateDishCategoryRequest
  extends DishCategoryRequest
  implements CreateDishCategoryRequestModel
{
  constructor(public readonly name: string) {
    super(name);
  }

  public get toFormData(): FormData {
    const formData = new FormData();
    formData.append(
      "createDishCategoryRequest",
      new Blob(
        [
          JSON.stringify({
            name: this.name,
          }),
        ],
        { type: "application/json" },
      ),
    );

    return formData;
  }
}
