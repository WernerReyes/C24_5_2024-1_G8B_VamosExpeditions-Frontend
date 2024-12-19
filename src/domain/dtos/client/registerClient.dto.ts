import { z } from "zod";
import { requestValidator } from "@/core/utils";
import { regex } from "@/core/constants";
import {
  externalCountryEntitySchema,
  type ExternalCountryEntity,
} from "@/infraestructure/services/external/country";

const { EMAIL } = regex;

export type RegisterClientDto = {
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly country: ExternalCountryEntity;
};

export const registerClientDto = (
  fullName: string,
  email: string,
  phone: string,
  country: ExternalCountryEntity
) => {
  return {
    create: (): [RegisterClientDto?, string[]?] => {
      const errors = requestValidator(
        {
          fullName,
          email,
          phone,
          country,
        },
        registerClientDtoSchema
      );
      if (errors) {
        return [undefined, errors];
      }
      return [{ fullName, email, phone, country }, undefined];
    },
  };
};

export const registerClientDtoSchema = z.object({
  fullName: z.string().min(1, {
    message: "El campo nombre es requerido",
  }),
  email: z
    .string()
    .min(1, {
      message: "El campo email es requerido",
    })
    .refine((value) => EMAIL.test(value), {
      message: "Email invalid, debe ser un email valido",
    }),
  phone: z.string().min(1, {
    message: "El campo telefono es requerido",
  }),
  country: externalCountryEntitySchema.refine(
    (country) =>
      !!country.name.trim() && // name no debe ser vacío
      !!country.code.trim() && // code no debe ser vacío
      country.image !== null && // image debe existir
      !!country.image.png.trim() && // png no debe ser vacío
      !!country.image.svg.trim(), // svg no debe ser vacío
    {
      message: "El campo país es inválido o incompleto",
    }
  ),
});
