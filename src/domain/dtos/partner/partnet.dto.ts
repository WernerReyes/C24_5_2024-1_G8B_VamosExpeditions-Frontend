import { z } from "zod";
import { dtoValidator } from "@/core/utils";

const partnerDtoSchema = z.object({
  id: z.number().int().nonnegative().optional().default(0),
  name: z.string().min(1, { message: "El campo name es requerido" }),
});

export type PartnerDto = z.infer<typeof partnerDtoSchema>;

export const partnerDto = {
  create: (dto: PartnerDto): [PartnerDto?, string[]?] => {
    const errors = dtoValidator(dto, partnerDtoSchema);
    if (errors) return [undefined, errors];
    return [dto, undefined];
  },
  getSchema: partnerDtoSchema,
};
