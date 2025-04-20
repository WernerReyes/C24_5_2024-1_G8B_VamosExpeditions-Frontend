import type { AppDispatch, AppState } from "@/app/store";
import type { ClientEntity } from "@/domain/entities";
import { versionQuotationService } from "../../versionQuotation.service";
import { extractedParams } from "../extractedParams";

export const updateByClient = function (
  data: ClientEntity,
  dispatch: AppDispatch,
  getState: () => AppState
) {
    const params = extractedParams(getState);
  
    //* Update the data in the cache for the query "getVersionQuotationById"
  for (const param of params) {
    const { getVersionQuotationById, getAllOfficialVersionQuotations } = param;

    if (getVersionQuotationById) {
      dispatch(
        versionQuotationService.util.updateQueryData(
          "getVersionQuotationById",
          getVersionQuotationById,
          (draft) => {
            Object.assign(draft, {
              data: {
                ...draft.data,
                tripDetails: {
                  ...draft.data.tripDetails,
                  ...(draft.data.tripDetails?.client?.id === data.id
                    ? { client: data }
                    : {}),
                },
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
                  if (item.tripDetails?.client?.id === data.id) {
                    return {
                      ...item,
                      tripDetails: {
                        ...item.tripDetails,
                        client: data,
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
