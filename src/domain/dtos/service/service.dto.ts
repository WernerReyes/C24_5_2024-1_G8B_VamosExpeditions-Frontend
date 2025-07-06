import { dtoValidator } from "@/core/utils";
import { z } from "zod";

const toNumberOrUndefined = (val: unknown) => {
  if (val === "" || val === null || val === undefined) return undefined;
  const num = Number(val);
  return isNaN(num) ? undefined : num;
};

export const serviceDtoSchema = z.object({
  id: z.number().optional().default(0),

  description: z.string().min(1, "Description is required"),
  duration: z.string().optional(),
  passengersMin: z.preprocess(toNumberOrUndefined, z.number().min(0).optional()),
  passengersMax: z.preprocess(toNumberOrUndefined, z.number().min(0).optional()),
  priceUsd: z.preprocess(toNumberOrUndefined, z.number().min(0).optional()),
  taxIgvUsd: z.preprocess(toNumberOrUndefined, z.number().min(0).optional()),
  rateUsd: z.preprocess(toNumberOrUndefined, z.number().min(0).optional()),
  pricePen: z.preprocess(toNumberOrUndefined, z.number().min(0).optional()),
  taxIgvPen: z.preprocess(toNumberOrUndefined, z.number().min(0).optional()),
  ratePen: z.preprocess(toNumberOrUndefined, z.number().min(0).optional()),
  districtId: z.string().min(1, { message: "El nombre del Distrito es requerido" }),
  serviceTypeId: z.number().min(1, { message: "El nombre del Tipo de servicio es requerido" }),
});

export type ServiceDto = z.infer<typeof serviceDtoSchema>;

export const serviceDto = {
  create: (dto: ServiceDto): [ServiceDto?, string[]?] => {
    const errors = dtoValidator(dto, serviceDtoSchema);
    if (errors) return [undefined, errors];
    return [dto, undefined];
  },
  getSchema: serviceDtoSchema,
};