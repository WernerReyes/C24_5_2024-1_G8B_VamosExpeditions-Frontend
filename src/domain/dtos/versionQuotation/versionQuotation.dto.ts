import { dtoValidator } from "@/core/utils";
import {
  VersionQuotationEntity,
  VersionQuotationStatus,
} from "@/domain/entities";
import { z } from "zod";

export const versionQuotationDtoSchema = z.object({
  id: z.object({
    quotationId: z.number(),
    versionNumber: z.number(),
  }),
  name: z.string(),
  status: z.nativeEnum(VersionQuotationStatus),
  official: z.boolean(),
  commission: z.number().optional(),
  partnerId: z.number().optional(),
  completionPercentage: z.number().optional(),
  indirectCostMargin: z.number().optional(),
  profitMargin: z.number().optional(),
  finalPrice: z.number().optional(),
})

export type VersionQuotationDto = z.infer<typeof versionQuotationDtoSchema>;

export const versionQuotationDto = {
  create: (dto: VersionQuotationDto): [VersionQuotationDto?, string[]?] => {
    const errors = dtoValidator(
      dto,
      versionQuotationDtoSchema
    );
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  parse: (entity: VersionQuotationEntity): VersionQuotationDto => {
    return {
      id: entity.id,
      name: entity.name,
      status: entity.status,
      official: entity.official,
      commission: entity.commission,
      partnerId: entity.partner?.id,
      completionPercentage: entity.completionPercentage,
      indirectCostMargin: entity.indirectCostMargin,
      profitMargin: entity.profitMargin,
      finalPrice: entity.finalPrice,
    };
  },
};
