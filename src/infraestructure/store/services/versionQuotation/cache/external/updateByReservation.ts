import type { AppDispatch, AppState } from "@/app/store";
import type { ReservationEntity } from "@/domain/entities";
import { versionQuotationService } from "../../versionQuotation.service";
import { extractedParams } from "../extractedParams";

export const updateByReservation = function (
  data: Partial<ReservationEntity>,
  dispatch: AppDispatch,
  getState: () => AppState
) {
  const params = extractedParams(getState);

  //* Update the data in the cache for the query "getVersionQuotationById"
  for (const param of params) {
    const { getAllOfficialVersionQuotations } = param;

    if (getAllOfficialVersionQuotations) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getAllOfficialVersionQuotations",
          getAllOfficialVersionQuotations,
          (draft) => {
            Object.assign(draft, {
              data: {
                ...draft.data,
                content: draft.data.content.map((item) => {
                  if (item.reservation?.id === data.id) {
                    return {
                      ...item,
                      reservation: {
                        ...item.reservation,
                        ...data,
                      },
                    };
                  }
                  return item;
                }),
              },
            });
          }
        )
      );
    }
  }
};
