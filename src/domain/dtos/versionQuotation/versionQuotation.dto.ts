import { requestValidator } from "@/core/utils";
import {
  VersionQuotationEntity,
  VersionQuotationStatus,
} from "@/domain/entities";
import { z } from "zod";

export type VersionQuotationDto = {
  readonly id: {
    readonly quotationId: number;
    readonly versionNumber: number;
  };
  readonly name: string;
  readonly status: VersionQuotationStatus;
  readonly official: boolean;
  readonly completionPercentage?: number;
  readonly indirectCostMargin?: number;
  readonly profitMargin?: number;
  readonly finalPrice?: number;
};

export const versionQuotationDto =  {
    create: (dto: VersionQuotationDto): [VersionQuotationDto?, string[]?] => {
      const errors = requestValidator(
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
        completionPercentage: entity.completionPercentage,
        indirectCostMargin: entity.indirectCostMargin,
        profitMargin: entity.profitMargin,
        finalPrice: entity.finalPrice,
      };
    },
  
};

export const versionQuotationDtoSchema = z.object({
  id: z.object({
    quotationId: z.number(),
    versionNumber: z.number(),
  }),
  name: z.string(),
  status: z.nativeEnum(VersionQuotationStatus),
  official: z.boolean(),
  completionPercentage: z.number().optional(),
  indirectCostMargin: z.number().optional(),
  profitMargin: z.number().optional(),
  finalPrice: z.number().optional(),
  reservationId: z.number().optional(),
});
