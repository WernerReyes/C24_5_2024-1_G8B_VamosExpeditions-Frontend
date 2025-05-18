import { z } from "zod";
import { generateEmptyObject, dtoValidator } from "@/core/utils";
import { regex } from "@/core/constants";
import type { ClientEntity } from "@/domain/entities";

const { EMAIL, PHONE } = regex;

const clientDtoSchema = z.object({
  fullName: z.string().min(1, {
    message: "El campo nombre es requerido",
  }),
  email: z
    .string()
    .optional()
    .nullable()
    .refine((value) => !value || EMAIL.test(value), {
      message: "El campo email es inválido",
    }),
  phone: z
    .string()
    .optional()
    .nullable()
    .refine((value) => !value || PHONE.test(value), {
      message:
        "El campo teléfono es inválido, debe tener el formato (+99..) 999999999..",
    }),
  country: z.string().min(1, {
    message: "El campo país es requerido",
  }),
  subregion: z.string({
    message: "El campo subregión es requerido",
  }),
  id: z.number().optional().default(0),
});

export type ClientDto = z.infer<typeof clientDtoSchema>;

export const clientDto = {
  create: (dto: ClientDto): [ClientDto?, string[]?] => {
    const errors = dtoValidator(dto, clientDtoSchema);
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
      country: entity.country.name,
      subregion: entity.subregion,
      id: entity.id,
    };
  },
  getEmpty: generateEmptyObject<ClientDto>(clientDtoSchema, {
    id: 0,
  }),

  getSchema: clientDtoSchema,
};
