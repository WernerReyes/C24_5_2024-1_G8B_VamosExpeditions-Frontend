import { z } from "zod";
import { generateEmptyObject, requestValidator } from "@/core/utils";
import { regex } from "@/core/constants";
import {
  type ExternalCountryEntity,
  externalCountryEntitySchema,
} from "@/infraestructure/store/services/external/country";

const { EMAIL, PHONE } = regex;

export type ClientDto = {
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly country: ExternalCountryEntity;
};

export const clientDto = (
  fullName: string,
  email: string,
  phone: string,
  country: ExternalCountryEntity
) => {
  return {
    create: (): [ClientDto?, string[]?] => {
      const errors = requestValidator(
        {
          fullName,
          email,
          phone,
          country,
        },
        clientDtoSchema
      );
      if (errors) {
        return [undefined, errors];
      }
      return [{ fullName, email, phone, country }, undefined];
    },
  };
};

export const clientDtoSchema = z.object({
  fullName: z.string().min(1, {
    message: "El campo nombre es requerido",
  }),
  email: z
    .string()
    .min(1, {
      message: "El campo email es requerido",
    })
    .regex(EMAIL, {
      message: "El campo email es inválido",
    }),
  phone: z
    .string()
    .min(1, {
      message: "El campo telefono es requerido",
    })
    .regex(PHONE, {
      message:
        "El campo teléfono es inválido, debe tener el formato (+99..) 999999999..",
    }),
  country: z.object(externalCountryEntitySchema.shape, {
    message: "El campo país es requerido",
  }),
});

export const clientDtoEmpty = generateEmptyObject<ClientDto>(clientDtoSchema);

