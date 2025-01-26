import { z } from "zod";
import { generateEmptyObject, requestValidator } from "@/core/utils";
import { regex } from "@/core/constants";
import { ClientEntity } from "@/domain/entities";

const { EMAIL, PHONE } = regex;

export type ClientDto = {
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly country: string;
  readonly subregion: string;
  readonly id?: number;
};

const clientDtoSchema = z.object({
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
  country: z.string().min(1, {
    message: "El campo país es requerido",
  }),
  subregion: z.string().min(1, {
    message: "El campo subregión es requerido",
  }),
  id: z.number().min(0),
});

export const clientDto = {
  create: (dto: ClientDto): [ClientDto?, string[]?] => {
    const errors = requestValidator(dto, clientDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  parse: (entity: ClientEntity): ClientDto => {
    return {
      fullName: entity.fullName,
      email: entity.email,
      phone: entity.phone,
      country: entity.country,
      subregion: entity.subregion,
      id: entity.id,
    };
  },
  getEmpty: generateEmptyObject<ClientDto>(clientDtoSchema),

  getSchema: clientDtoSchema,
};
