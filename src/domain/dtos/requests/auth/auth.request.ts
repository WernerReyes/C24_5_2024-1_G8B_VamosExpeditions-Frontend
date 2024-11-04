import { Regex } from "@/core/constants";
import { z } from "zod";

const { EMAIL, PASSWORD } = Regex;

export type AuthRequestModel = {
  readonly email: string;
  readonly password: string;
};

export class AuthRequest implements AuthRequestModel {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}

  protected validate() {
    requestValidator(this, AuthRequest.schema);
  }

  public static get schema(): z.ZodSchema<AuthRequestModel> {
    return AuthRequestSchema;
  }
}

export const AuthRequestSchema = z.object({
  email: z.string().refine((value) => EMAIL.test(value), {
    message: "Email invalid, follow the suggestions and try again",
  }),
  password: z.string().refine((value) => PASSWORD.test(value), {
    message: "Password invalid, follow the suggestions and try again",
  }),
});
