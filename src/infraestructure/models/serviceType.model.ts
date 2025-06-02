import { fromModelToString } from "@/core/utils";
import { z } from "zod";
import { serviceModelSchemaPartial } from "./service.model";

export const serviceTypeModelSchemaPartial = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
});

const serviceTypeModelSchema = z
  .object(serviceTypeModelSchemaPartial.shape)
  .merge(
    z.object({
      service: z.lazy(() => z.array(serviceModelSchemaPartial)).optional(),
    })
  );

export type ServiceTypeModel = z.infer<typeof serviceTypeModelSchema>;

export const serviceTypeModel = {
  schema: serviceTypeModelSchema,
  toString: (serviceType?: ServiceTypeModel): string | undefined => {
    return serviceType ? fromModelToString(serviceType) : undefined;
  },
} as const;
