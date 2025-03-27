import { HotelRoomTripDetailsEntity } from "@/domain/entities";
import { ApiResponse } from "../response";
import { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { RootState } from "@reduxjs/toolkit/query";
import { hotelRoomTripDetailsService } from "./hotelRoomTripDetails.service";
import { dateFnsAdapter } from "@/core/adapters";

export const hotelRoomTripDetailsCache = {
  createManyHotelRoomTripDetails: function (
    data: ApiResponse<HotelRoomTripDetailsEntity[]>,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, "hotelRoomTripDetailsService">
  ) {
    const args = hotelRoomTripDetailsService.util.selectCachedArgsForQuery(
      getState(),
      "getAllHotelRoomTripDetails"
    );

    args.forEach((arg) => {
      dispatch(
        hotelRoomTripDetailsService.util.updateQueryData(
          "getAllHotelRoomTripDetails",
          arg,
          (draft) => {
            Object.assign(draft, {
              data: draft.data.concat(
                data.data.map((hotelRoomTripDetails) => {
                  return {
                    ...hotelRoomTripDetails,
                    date: dateFnsAdapter.parseISO(hotelRoomTripDetails.date),
                  };
                })
              ),
            });
          }
        )
      );
    });
  },

  uodateManyHotelRoomTripDetailsByDate: function (
    data: ApiResponse<HotelRoomTripDetailsEntity[]>,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, "hotelRoomTripDetailsService">
  ) {
    const args = hotelRoomTripDetailsService.util.selectCachedArgsForQuery(
      getState(),
      "getAllHotelRoomTripDetails"
    );

    args.forEach((arg) => {
      dispatch(
        hotelRoomTripDetailsService.util.updateQueryData(
          "getAllHotelRoomTripDetails",
          arg,
          (draft) => {
            Object.assign(draft, {
              data: draft.data.map((hotelRoomTripDetails) => {
                const dataToUpdate = data.data.find(
                  (data) => data.id === hotelRoomTripDetails.id
                );

                if (dataToUpdate) {
                  return {
                    ...dataToUpdate,
                    date: dateFnsAdapter.parseISO(dataToUpdate.date),
                  };
                }

                return hotelRoomTripDetails;
              }),
            });
          }
        )
      );
    });
  },

  deleteHotelRoomTripDetails: function (
    data: ApiResponse<HotelRoomTripDetailsEntity>,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, "hotelRoomTripDetailsService">
  ) {
    const args = hotelRoomTripDetailsService.util.selectCachedArgsForQuery(
      getState(),
      "getAllHotelRoomTripDetails"
    );

  
    args.forEach((arg) => {
      dispatch(
        hotelRoomTripDetailsService.util.updateQueryData(
          "getAllHotelRoomTripDetails",
          arg,
          (draft) => {
            console.log(draft.data.filter(
                (hotelRoomTripDetails) =>
                  hotelRoomTripDetails.id !== data.data.id
              ),
            );
            Object.assign(draft, {
              data: draft.data.filter(
                (hotelRoomTripDetails) =>
                  hotelRoomTripDetails.id !== data.data.id
              ),
            });
          }
        )
      );
    });
  },

  deleteManyHotelRoomTripDetails: function (
    data: ApiResponse<HotelRoomTripDetailsEntity[]>,
    dispatch: ThunkDispatch<any, any, UnknownAction>,
    getState: () => RootState<any, any, "hotelRoomTripDetailsService">
  ) {
    const args = hotelRoomTripDetailsService.util.selectCachedArgsForQuery(
      getState(),
      "getAllHotelRoomTripDetails"
    );

    args.forEach((arg) => {
      dispatch(
        hotelRoomTripDetailsService.util.updateQueryData(
          "getAllHotelRoomTripDetails",
          arg,
          (draft) => {
            Object.assign(draft, {
              data: draft.data.filter(
                (hotelRoomTripDetails) =>
                  !data.data.some(
                    (data) => data.id === hotelRoomTripDetails.id
                  )
              ),
            });
          }
        )
      );
    });
  }
};
