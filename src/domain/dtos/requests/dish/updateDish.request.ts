import { requestValidator } from "@/presentation/utilities";
import { z, ZodSchema } from "zod";
import { DishRequest, DishRequestModel, DishRequestSchema } from "./dish.request";

interface UpdateDishRequestModel extends DishRequestModel {
  readonly dishId: number;
}
export class UpdateDishRequest extends DishRequest implements UpdateDishRequestModel {
  constructor(
    public readonly dishId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly categoriesId: number[],
    public readonly stock: number,
  ) {
    super(name, description, price, categoriesId, stock);
  }

  public override validate() {
    requestValidator(this, UpdateDishRequest.schema);
  }


  public static override get schema(): ZodSchema<UpdateDishRequestModel> {
    return UpdateDishRequestSchema;
  }
}

const UpdateDishRequestSchema = z.object({
  dishId: z.number({
    message: "Dish id is required",
  }),
  ...DishRequestSchema.shape,
});
