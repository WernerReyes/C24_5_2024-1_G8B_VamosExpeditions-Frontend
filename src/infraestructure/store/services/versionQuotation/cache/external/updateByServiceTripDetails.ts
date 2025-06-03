import { ServiceTripDetailsEntity } from "@/domain/entities";
import { versionQuotationService } from "../../versionQuotation.service";
import { AppDispatch, AppState } from "@/app/store";
import { dateFnsAdapter } from "@/core/adapters";
import { extractedParams } from "../extractedParams";

export const addMultipleServiceTripDetails = function (
  data: ServiceTripDetailsEntity[],
  dispatch: AppDispatch,
  getState: () => AppState
) {
  const params = extractedParams(getState);

  for (const param of params) {
    const { getVersionQuotationById } = param;

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
                  serviceTripDetails: [
                    ...(
                      draft.data.tripDetails?.serviceTripDetails ?? []
                    ).concat(
                      data.map((serviceTripDetails) => {
                        return {
                          ...serviceTripDetails,
                          date: dateFnsAdapter.parseISO(
                            serviceTripDetails.date
                          ),
                        };
                      })
                    ),
                  ],
                },
              },
            });
          }
        )
      );
    }
  }
};

export const updateManyServicesTripDetailsByDate = function (
  data: ServiceTripDetailsEntity[],
  dispatch: AppDispatch,
  getState: () => AppState
) {
  const params = extractedParams(getState);

  for (const param of params) {
    const { getVersionQuotationById } = param;

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
                  serviceTripDetails:
                    draft.data?.tripDetails?.serviceTripDetails?.map(
                      (serviceTripDetails) => {
                        const dataToUpdate = data.find(
                          (item) => item.id === serviceTripDetails.id
                        );

                        if (dataToUpdate) {
                          return {
                            ...dataToUpdate,
                            date: dateFnsAdapter.parseISO(dataToUpdate.date),
                          };
                        }

                        return serviceTripDetails;
                      }
                    ),
                },
              },
            });
          }
        )
      );
    }
  }
};

export const deleteManyServicesTripDetails = function (
    ids: ServiceTripDetailsEntity["id"][],
    dispatch: AppDispatch,
    getState: () => AppState
  ) {
    const params = extractedParams(getState);
  
    for (const param of params) {
      const { getVersionQuotationById } = param;
  
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
                    serviceTripDetails:
                      draft.data?.tripDetails?.serviceTripDetails?.filter(
                        (hotelRoomTripDetails) =>
                          !ids.some(
                            (id) => id === hotelRoomTripDetails.id
                          )
                      ),
                  },
                },
              });
            }
          )
        );
      }
    }
  };
  