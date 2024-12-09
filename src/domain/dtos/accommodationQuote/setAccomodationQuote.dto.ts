import { requestValidator } from "@/core/utils";
import {
  accommodationRoomEntitySchema,
  type AccommodationRoomEntity,
} from "@/domain/entities";
import { z } from "zod";

export type SetAccomodationQuoteDto = {
  readonly accommodationRoom: AccommodationRoomEntity;
  readonly customerNumber: number;
  readonly day: number;
  readonly versionQuotation: null;
  readonly date: string;
};

// export interface AccommodationQuoteEntity {
//   readonly id: number;
//   readonly accommodationRoom: AccommodationRoomEntity
//   readonly customerNumber: number;
//   readonly total: number;
//   readonly versionQuotation: null;
//   readonly day: number;
// }

export const setAccomodationQuoteDto = (
  accommodationRoom: AccommodationRoomEntity,
  customerNumber: number,
  day: number,
  versionQuotation: null,
  date: string
) => {
  return {
    create: (): [SetAccomodationQuoteDto?, string[]?] => {
      const errors = requestValidator(
        {
          accommodationRoom,
          customerNumber,
          day,
          versionQuotation,
          date
        },
        setAccomodationQuoteDtoSchema
      );
      if (errors) {
        return [undefined, errors];
      }
      return [{ accommodationRoom, customerNumber, day, versionQuotation, date }, undefined];
    },
  };
};

export const setAccomodationQuoteDtoSchema = z.object({
  accommodationRoom: z.lazy(() => accommodationRoomEntitySchema),
  customerNumber: z.number(),
  day: z.number(),
  versionQuotation: z.null(),
  date: z.string(),
});
