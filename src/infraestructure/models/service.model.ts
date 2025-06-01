import { fromModelToString } from "@/core/utils";
import { z } from "zod";
import { districtModelSchemaPartial } from "./district.model";
import { serviceTripDetailsModelSchemaPartial } from "./serviceTripDetails.model";
import { serviceTypeModelSchemaPartial } from "./serviceType.model";

export const serviceModelSchemaPartial = z.object({
  id: z.boolean().optional(),
  service_type_id: z.boolean().optional(),
  description: z.boolean().optional(),
  duration: z.boolean().optional(),
  passengers_min: z.boolean().optional(),
  passengers_max: z.boolean().optional(),
  price_usd: z.boolean().optional(),
  tax_igv_usd: z.boolean().optional(),
  rate_usd: z.boolean().optional(),
  price_pen: z.boolean().optional(),
  tax_igv_pen: z.boolean().optional(),
  rate_pen: z.boolean().optional(),
  distrit_id: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
});

const serviceModelSchema = z.object(serviceModelSchemaPartial.shape).merge(
  z.object({
    distrit: z
      .lazy(() =>
        z
          .object({
            ...districtModelSchemaPartial.shape,
          })
          .optional()
      )
      .optional(),
    service_type: z
      .lazy(() =>
        z
          .object({
            ...serviceTypeModelSchemaPartial.shape,
          })
          .optional()
      )
      .optional(),
    service_trip_details: z.lazy(() =>
      z
        .array(
          z
            .object({
              ...serviceTripDetailsModelSchemaPartial.shape,
            })
            .optional()
        )
        .optional()
    ),
  })
);

export type ServiceModel = z.infer<typeof serviceModelSchema>;

export const serviceModel = {
  schema: serviceModelSchema,
  toString: (service?: ServiceModel): string | undefined => {
    return service ? fromModelToString(service) : undefined;
  },
} as const;
