import { z } from "zod";
import { serviceModelSchemaPartial } from "./service.model";
import {
  tripDetailsModelSchemaPartial
} from "./tripDetails.model";

export const serviceTripDetailsModelSchemaPartial = z.object({
  id: z.boolean().optional(),
  trip_details_id: z.boolean().optional(),
  service_id: z.boolean().optional(),
  date: z.boolean().optional(),
  cost_person: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
});

const serviceTripDetailsModelSchema = z
  .object(serviceTripDetailsModelSchemaPartial.shape)
  .merge(
    z.object({
      service: z.lazy(() => serviceModelSchemaPartial).optional(),
      trip_details: z.lazy(() => tripDetailsModelSchemaPartial).optional(),
    })
  );

export type ServiceTripDetailsModel = z.infer<
  typeof serviceTripDetailsModelSchema
>;

export const ServiceTripDetailsModel = {
  schema: serviceTripDetailsModelSchema,
} as const;
