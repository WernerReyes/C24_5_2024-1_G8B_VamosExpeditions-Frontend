import type { AppState } from "@/app/store";
import type { ClientEntity } from "@/domain/entities";
import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { extractedParams } from "./extractedParams";
import { versionQuotationService } from "../../versionQuotation.service";

export const updateVersionQuotationByClient = function (
  data: ClientEntity,
  dispatch: ThunkDispatch<any, any, UnknownAction>,
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
