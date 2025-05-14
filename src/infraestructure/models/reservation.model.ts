import { fromModelToString } from "@/core/utils";
import { z } from "zod";
import { quotationModelSchemaPartial } from "./quotation.model";
import { versionQuotationModelSchemaPartial } from "./versionQuotation.model";
import { tripDetailsModelSchemaPartial } from "./tripDetails.model";
import { clientModelSchemaPartial } from "./client.model";
import { userModelSchemaPartial } from "./user.model";
import { tripDetailsHasCityModelSchemaPartial } from "./tripDetailsHasCity.model";
import { cityModelSchemaPartial } from "./city.model";

export const reservationModelSchemaPartial = z.object({
  id: z.boolean().optional(),
  quotation_id: z.boolean().optional(),
  status: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  is_deleted: z.boolean().optional(),
  deleted_at: z.boolean().optional(),
  delete_reason: z.boolean().optional(),
});

export const reservationModelSchema = reservationModelSchemaPartial.merge(
  z.object({
    quotation: z
      .lazy(() =>
        z.object({
          ...quotationModelSchemaPartial.shape,
          version_quotation: z
            .lazy(() =>
              z
                .array(
                  z.object({
                    ...versionQuotationModelSchemaPartial.shape,
                    trip_details: z
                      .lazy(() =>
                        z.object({
                          ...tripDetailsModelSchemaPartial.shape,
                          client: z
                            .lazy(() =>
                              z.object({
                                ...clientModelSchemaPartial.shape,
                              })
                            )
                            .optional(),
                          trip_details_has_city: z
                            .lazy(() =>
                              z
                                .array(
                                  z.object({
                                    ...tripDetailsHasCityModelSchemaPartial.shape,
                                    city: z
                                      .lazy(() =>
                                        z.object({
                                          ...cityModelSchemaPartial.shape,
                                        })
                                      )
                                      .optional(),
                                  })
                                )
                                .optional()
                            )
                            .optional(),
                        })
                      )
                      .optional(),
                    user: z
                      .lazy(() => z.object({ ...userModelSchemaPartial.shape }))
                      .optional(),
                  })
                )
                .optional()
            )
            .optional(),
        })
      )
      .optional(),
  })
);

export type ReservationModel = z.infer<typeof reservationModelSchema>;

export const reservationModel = {
  schema: reservationModelSchema,
  toString: (reservation?: ReservationModel): string | undefined =>
    reservation ? fromModelToString(reservation) : undefined,
};
