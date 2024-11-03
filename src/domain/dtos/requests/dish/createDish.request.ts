import { DishRequest, type DishRequestModel } from "./dish.request";

interface CreateDishRequestModel extends DishRequestModel {}

export class CreateDishRequest
  extends DishRequest
  implements CreateDishRequestModel
{
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly categoriesId: number[],
    public readonly stock: number,
  ) {
    super(name, description, price, categoriesId, stock);
  }

  public get toFormData(): FormData {
    const formData = new FormData();
    formData.append(
      "createDishRequest",
      new Blob(
        [
          JSON.stringify({
            name: this.name,
            description: this.description,
            price: this.price,
            stock: this.stock,
            categoriesId: this.categoriesId,
          }),
        ],
        { type: "application/json" },
      ),
    );

    return formData;
  }
}
