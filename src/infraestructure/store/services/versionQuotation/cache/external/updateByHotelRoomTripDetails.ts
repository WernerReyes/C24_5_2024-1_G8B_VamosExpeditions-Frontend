import type { AppDispatch, AppState } from "@/app/store";
import { dateFnsAdapter } from "@/core/adapters";
import type { HotelRoomTripDetailsEntity } from "@/domain/entities";
import { versionQuotationService } from "../../versionQuotation.service";
import { extractedParams } from "../extractedParams";

export const addMultipleHotelRoomTripDetails = function (
  data: HotelRoomTripDetailsEntity[],
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
                  hotelRoomTripDetails: [
                    ...(
                      draft.data.tripDetails?.hotelRoomTripDetails ?? []
                    ).concat(
                      data.map((hotelRoomTripDetails) => {
                        return {
                          ...hotelRoomTripDetails,
                          date: dateFnsAdapter.parseISO(
                            hotelRoomTripDetails.date
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

export const updateManyHotelRoomTripDetailsByDate = function (
  data: HotelRoomTripDetailsEntity[],
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
                  hotelRoomTripDetails:
                    draft.data?.tripDetails?.hotelRoomTripDetails?.map(
                      (hotelRoomTripDetails) => {
                        const dataToUpdate = data.find(
                          (item) => item.id === hotelRoomTripDetails.id
                        );

                        if (dataToUpdate) {
                          return {
                            ...dataToUpdate,
                            date: dateFnsAdapter.parseISO(dataToUpdate.date),
                          };
                        }

                        return hotelRoomTripDetails;
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

export const deleteHotelRoomTripDetails = function (
    data: HotelRoomTripDetailsEntity,
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
                    hotelRoomTripDetails:
                      draft.data?.tripDetails?.hotelRoomTripDetails?.filter(
                        (hotelRoomTripDetails) =>
                          hotelRoomTripDetails.id !== data.id
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


export const deleteManyHotelRoomTripDetails = function (
  data: HotelRoomTripDetailsEntity[],
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
                  hotelRoomTripDetails:
                    draft.data?.tripDetails?.hotelRoomTripDetails?.filter(
                      (hotelRoomTripDetails) =>
                        !data.some(
                          (item) => item.id === hotelRoomTripDetails.id
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
