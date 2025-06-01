import { regex } from "@/core/constants";
import { dtoValidator } from "@/core/utils";
import { z } from "zod";

const { PASSWORD } = regex;

const disconnectDeviceDtoSchema = z.object({
  deviceId: z.string(),
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

export type DisconnectDeviceDto = z.infer<typeof disconnectDeviceDtoSchema>;

export const disconnectDeviceDto = {
  create: (dto: DisconnectDeviceDto): [DisconnectDeviceDto?, string[]?] => {
    const errors = dtoValidator(dto, disconnectDeviceDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
