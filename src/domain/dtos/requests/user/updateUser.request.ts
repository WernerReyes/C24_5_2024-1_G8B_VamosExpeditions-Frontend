import { z } from "zod";
import { requestValidator, regularExpressions } from "@/presentation/utilities";

const { DNI, PHONE } = regularExpressions;

type UpdateUserRequestModel = {
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNumber?: string;
  readonly dni?: string;
};

export class UpdateUserRequest implements UpdateUserRequestModel {
  private constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phoneNumber?: string,
    public readonly dni?: string,
  ) {}

  public validate() {
    requestValidator(this, UpdateUserRequest.schema);
  }

  public static get schema(): z.ZodSchema<UpdateUserRequestModel> {
    return UpdateUserRequestSchema;
  }
}

const UpdateUserRequestSchema = z.object({
  firstName: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(60, "Name must be at most 60 characters long"),

  lastName: z
    .string()
    .min(3, "Last name must be at least 3 characters long")
    .max(60, "Last name must be at most 60 characters long"),
  dni: z
    .string()
    .optional()
    .refine((value) => (value ? DNI.test(value) : true), {
      message: "DNI must be 8 characters long and contain only numbers",
    }),
  phoneNumber: z
    .string()
    .optional()
    .refine((value) => (value ? PHONE.test(value) : true), {
      message: "Phone must be 9 characters long and contain only numbers",
    }),
});
