import { z } from "zod";
import { requestValidator } from "@/presentation/utilities";

type PutDishOfferRequestModel = {
  readonly dishId: number;
  readonly discountPercentage: number;
  readonly saleStartDate: Date;
  readonly saleEndDate: Date;
};

export class PutDishOfferRequest implements PutDishOfferRequestModel {
  constructor(
    public readonly dishId: number,
    public readonly discountPercentage: number,
    public readonly saleStartDate: Date,
    public readonly saleEndDate: Date,
  ) {}

  public validate() {
    requestValidator(this, PutDishOfferRequest.schema);
  }

  public static get schema(): z.ZodSchema<PutDishOfferRequestModel> {
    return PutDiscountDishOfferRequestSchema;
  }
}

const PutDiscountDishOfferRequestSchema = z.object({
  dishId: z.number({
    message: "dishId is required",
  }),
  discountPercentage: z
    .number({
      message: "discountPercentage is required",
    })
    .nonnegative("discount Percentage must be greater than 0")
    .min(1, "discount Percentage must be greater than 0")

    .max(100, "discount Percentage must be less than 100"),

  saleStartDate: z
    .date({
      message: "saleStartDate is required",
    })
    .min(new Date(), "saleStartDate must be greater than current date"),

  saleEndDate: z
    .date({
      message: "saleEndDate is required",
    })
    .min(new Date(), "saleEndDate must be greater than current date"),
});
