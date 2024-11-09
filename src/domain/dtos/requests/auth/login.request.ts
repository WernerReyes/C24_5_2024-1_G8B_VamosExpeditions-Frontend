import { z } from "zod";
import { regex } from "@/core/constants";
import { requestValidator } from "@/core/utils";

const { EMAIL, PASSWORD } = regex;

export type LoginRequest = {
  readonly email: string;
  readonly password: string;
};

export const loginRequest = (email: string, password: string) => {
  return {
    from: (): [LoginRequest?, string[]?] => {
      const errors = requestValidator(
        {
          email,
          password,
        },
        loginRequestSchema
      );
      if (errors) {
        return [undefined, errors];
      }
      return [{ email, password }, undefined];
    },
  };
};

export const loginRequestSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "El campo email es requerido",
    })
    .refine((value) => EMAIL.test(value), {
      message: "Email invalid, debe ser un email valido",
    }),
  password: z
    .string()
    .min(1, {
      message: "El campo password es requerido",
    })
    .refine((value) => PASSWORD.test(value), {
      message:
        "Password invalid, debe tener al menos 8 caracteres, una letra mayuscula, una letra minuscula y un numero",
    }),
});
