import { z, ZodSchema } from "zod";
import { requestValidator } from "@/presentation/utilities";
export interface DishRequestModel {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly categoriesId: number[];
  readonly stock: number;
}

export class DishRequest implements DishRequestModel {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly categoriesId: number[],
    public readonly stock: number,
  ) {}

  public validate() {
    requestValidator(this, DishRequest.schema);
  }

  public static get schema(): ZodSchema<DishRequestModel> {
    return DishRequestSchema;
  }
}

export const DishRequestSchema = z.object({
  name: z
    .string({
      message: "Name is required",
    })
    .min(3, "Name must be between 3 and 50 characters")
    .max(50, "Name must be between 3 and 50 characters"),
  description: z
    .string({
      message: "Description is required",
    })
    .min(3, "Description must be between 3 and 255 characters")
    .max(255, "Description must be between 3 and 255 characters"),
  price: z
    .number({
      message: "Price is required",
    })
    .min(0, "Price must be greater than 0")
    .max(999999.99, "Price must be less than 999999.99"),
  categoriesId: z
    .array(z.number({ message: "Categories must be an array of numbers" }))
    .nonempty("At least one category is required and at most 5"),
  stock: z
    .number({
      message: "Stock is required",
    })
    .min(0, "Stock must be greater than 0"),
});
