import type { AppDispatch, AppState } from "@/app/store";
import type { TripDetailsEntity } from "@/domain/entities";
import { versionQuotationService } from "../../versionQuotation.service";
import { extractedParams } from "../extractedParams";

export const updateByTripDetails = function (
  data: TripDetailsEntity,
  dispatch: AppDispatch,
  getState: () => AppState
) {
  const params = extractedParams(getState);

  //* Update the data in the cache for the query "getVersionQuotationById"
  for (const param of params) {
    const { getVersionQuotationById, getAllOfficialVersionQuotations, getAllUnofficialVersionQuotations } = param;

    if (getVersionQuotationById) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getVersionQuotationById",
          getVersionQuotationById,
          (draft) => {
            Object.assign(draft, {
              data: {
                ...draft.data,
                ...(draft.data.tripDetails?.id === data.id
                  ? {
                      tripDetails: {
                        ...draft.data.tripDetails,
                        ...data,
                      },
                    }
                  : {
                      tripDetails: data,
                    }),
              },
            });
          }
        )
      );
    }

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
                  if (item?.tripDetails?.id === data.id) {
                    return {
                      ...item,
                      tripDetails: data,
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

    if (getAllUnofficialVersionQuotations) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getAllUnofficialVersionQuotations",
          getAllUnofficialVersionQuotations,
          (draft) => {
            Object.assign(draft, {
              data: {
                ...draft.data,
                content: draft.data.content.map((item) => {
                  if (item?.tripDetails?.id === data.id) {
                    return {
                      ...item,
                      tripDetails: data,
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
