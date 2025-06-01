import { dtoValidator } from "@/core/utils";
import { z } from "zod";

const serviceDtoSchema = z.object({
  id: z.number().min(1).optional(),
  description: z.string().min(1, "Description is required"),
  duration: z.string().optional(),
  passengersMin: z.number().min(1).optional(),
  passengersMax: z.number().min(1).optional(),
  priceUsd: z.number().min(0).optional(),
  taxIgvUsd: z.number().min(0).optional(),
  rateUsd: z.number().min(0).optional(),
  pricePen: z.number().min(0).optional(),
  taxIgvPen: z.number().min(0).optional(),
  ratePen: z.number().min(0).optional(),
  districtId: z.number().min(1).optional(),
  serviceTypeId: z.number().min(1).optional(),
});

export type ServiceDto = z.infer<typeof serviceDtoSchema>;

export const serviceDto = {
  create: (dto: ServiceDto): [ServiceDto?, string[]?] => {
    const errors = dtoValidator(dto, serviceDtoSchema);
    if (errors) return [undefined, errors];
    return [dto, undefined];
  },
};